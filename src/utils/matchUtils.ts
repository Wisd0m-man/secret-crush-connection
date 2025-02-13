
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

const sendMatchEmail = async (toEmail: string, userName: string, crushName: string) => {
  try {
    console.log('Attempting to send match email to:', toEmail);
    const response = await supabase.functions.invoke('send-match-email', {
      body: {
        userEmail: toEmail,
        userName: userName,
        crushName: crushName
      }
    });

    if (response.error) {
      console.error('Error response from send-match-email function:', response.error);
      throw response.error;
    }

    console.log('Match email sent successfully to:', toEmail);
    return response.data;
  } catch (error) {
    console.error('Error sending match email:', error);
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
    
    try {
      // Send emails to both users
      console.log("Sending match emails...");
      await Promise.all([
        sendMatchEmail(currentSubmission.email, currentSubmission.name, matchData.name),
        sendMatchEmail(matchData.email, matchData.name, currentSubmission.name)
      ]);
      console.log("Match emails sent successfully");
    } catch (emailError) {
      console.error("Error sending match emails:", emailError);
      // Continue with match process even if email sending fails
    }

    // Update match status for both entries
    await updateMatchStatus(currentSubmission.usn, currentSubmission.crushUsn);
    
    return matchData;
  } catch (error) {
    console.error("Error in checkForMatch:", error);
    throw error;
  }
};
