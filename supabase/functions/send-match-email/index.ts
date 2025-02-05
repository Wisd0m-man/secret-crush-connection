
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
    const { to_email1, to_name1, to_email2, to_name2, message } = await req.json() as EmailData;

    console.log("Sending match emails to:", { to_email1, to_name1, to_email2, to_name2 });

    // Send email to first person
    const email1Response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_name: to_name1,
          to_name2: to_name2,
          to_email: to_email1,
          message,
        },
      }),
    });

    // Send email to second person
    const email2Response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_name: to_name2,
          to_name2: to_name1,
          to_email: to_email2,
          message,
        },
      }),
    });

    if (!email1Response.ok || !email2Response.ok) {
      console.error('Email 1 response:', await email1Response.text());
      console.error('Email 2 response:', await email2Response.text());
      throw new Error('Failed to send one or both match notification emails');
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
    console.error('Error sending match emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
