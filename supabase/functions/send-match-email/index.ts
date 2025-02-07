
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_9yx3m4v";
const EMAILJS_TEMPLATE_ID = "template_0mt2u5a";
const EMAILJS_PUBLIC_KEY = "RuLQCc8bDcS8aa_Ig";

interface EmailData {
  to_email1: string;
  to_name1: string;
  to_email2: string;
  to_name2: string;
  message: string;
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
      template_params: {
        to_name: to_name2,
        to_name2: to_name1,
        to_email: to_email2,
        message,
      },
    };

    console.log("Sending first email with payload:", emailPayload1);
    // Send email to first person
    const email1Response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload1),
    });

    console.log("First email response status:", email1Response.status);
    if (!email1Response.ok) {
      const errorText = await email1Response.text();
      console.error('First email error:', errorText);
      throw new Error(`Failed to send first email: ${errorText}`);
    }

    console.log("Sending second email with payload:", emailPayload2);
    // Send email to second person
    const email2Response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload2),
    });

    console.log("Second email response status:", email2Response.status);
    if (!email2Response.ok) {
      const errorText = await email2Response.text();
      console.error('Second email error:', errorText);
      throw new Error(`Failed to send second email: ${errorText}`);
    }

    console.log("Successfully sent both match emails");

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
