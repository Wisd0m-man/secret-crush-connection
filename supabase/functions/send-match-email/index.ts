
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_9yx3m4v";
const EMAILJS_TEMPLATE_ID = "template_0mt2u5a";
const EMAILJS_PUBLIC_KEY = "RuLQCc8bDcS8aa_Ig";
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

interface EmailData {
  to_email1: string;
  to_name1: string;
  to_email2: string;
  to_name2: string;
  message: string;
}

async function sendEmailJS(payload: any) {
  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': 'http://localhost',  // Add origin header
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS API Error (${response.status}): ${errorText}`);
  }

  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData = await req.json() as EmailData;
    console.log("Received email request:", emailData);

    const { to_email1, to_name1, to_email2, to_name2, message } = emailData;

    if (!to_email1 || !to_name1 || !to_email2 || !to_name2) {
      console.error('Missing required email data:', emailData);
      throw new Error('Missing required email data');
    }

    // Prepare email payload for first person
    const emailPayload1 = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PUBLIC_KEY, // Add access token
      template_params: {
        to_name: to_name1,
        to_name2: to_name2,
        to_email: to_email1,
        message,
      },
    };

    // Prepare email payload for second person
    const emailPayload2 = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PUBLIC_KEY, // Add access token
      template_params: {
        to_name: to_name2,
        to_name2: to_name1,
        to_email: to_email2,
        message,
      },
    };

    try {
      console.log("Sending first email with payload:", emailPayload1);
      await sendEmailJS(emailPayload1);
      console.log("First email sent successfully");

      console.log("Sending second email with payload:", emailPayload2);
      await sendEmailJS(emailPayload2);
      console.log("Second email sent successfully");

    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      throw new Error(`Email sending failed: ${emailError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in send-match-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
