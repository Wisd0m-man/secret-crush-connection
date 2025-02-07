
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export interface MatchFormData {
  name: string;
  email: string;
  usn: string;
  crushName: string;
  crushUsn: string;
}

type CrushRow = Database['public']['Tables']['crushes']['Row'];
type CrushUpdate = Database['public']['Tables']['crushes']['Update'];

export const sendMatchEmail = async (person1: MatchFormData, person2: CrushRow) => {
  try {
    console.log("Sending match email to:", person1.email, "and", person2.email);
    const response = await supabase.functions.invoke('send-match-email', {
      body: {
        to_email1: person1.email,
        to_name1: person1.name,
        to_email2: person2.email,
        to_name2: person2.name,
        message: "Congratulations! You have a mutual crush match! 💘"
      }
    });

    if (response.error) {
      console.error('Error sending match email:', response.error);
      throw new Error(response.error.message);
    }
    
    console.log('Match email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error in sendMatchEmail:', error);
    throw error;
  }
};

export const updateMatchStatus = async (usn1: string, usn2: string) => {
  try {
    const updates = [
      supabase
        .from('crushes')
        .update({ status: 'matched' } as CrushUpdate)
        .eq('usn', usn1)
        .eq('crush_usn', usn2),
      supabase
        .from('crushes')
        .update({ status: 'matched' } as CrushUpdate)
        .eq('usn', usn2)
        .eq('crush_usn', usn1)
    ];

    const results = await Promise.all(updates);
    console.log('Match status update results:', results);
    return true;
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
};

export const checkForMatch = async (currentSubmission: MatchFormData) => {
  try {
    console.log("Checking for match with:", currentSubmission);
    
    // First, check if there's a matching crush entry
    const { data: matchData, error: matchError } = await supabase
      .from('crushes')
      .select('*')
      .eq('usn', currentSubmission.crushUsn)
      .eq('crush_usn', currentSubmission.usn)
      .eq('status', 'pending')
      .limit(1)
      .maybeSingle();

    if (matchError) {
      console.error("Error checking for match:", matchError);
      throw matchError;
    }

    if (!matchData) {
      console.log("No match found yet");
      return null;
    }

    console.log("Match found!", { currentSubmission, matchData });
    return matchData;
  } catch (error) {
    console.error("Error in checkForMatch:", error);
    throw error;
  }
};
