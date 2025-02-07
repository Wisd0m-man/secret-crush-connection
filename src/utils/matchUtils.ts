
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

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error updating match status:', error);
    throw error;
  }
};

export const checkForMatch = async (currentSubmission: MatchFormData) => {
  try {
    console.log("Checking for match with:", currentSubmission);
    
    // Check for existing mutual crush
    const { data: matches, error: matchError } = await supabase
      .from('crushes')
      .select('*')
      .eq('usn', currentSubmission.crushUsn)
      .eq('crush_usn', currentSubmission.usn)
      .eq('status', 'pending')
      .single();
    
    if (matchError) {
      if (matchError.code === 'PGRST116') {
        console.log("No match found yet");
        return null;
      }
      console.error("Error checking for match:", matchError);
      throw matchError;
    }
    
    console.log("Match found!", { currentSubmission, matches });
    return matches;
  } catch (error) {
    console.error("Error in checkForMatch:", error);
    throw error;
  }
};
