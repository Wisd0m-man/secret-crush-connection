
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MatchEmailRequest {
  userEmail: string;
  userName: string;
  crushName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the received request
    console.log("Received request:", await req.clone().text());
    
    const { userEmail, userName, crushName }: MatchEmailRequest = await req.json();

    // Validate required fields
    if (!userEmail || !userName || !crushName) {
      console.error("Missing required fields:", { userEmail, userName, crushName });
      throw new Error("Missing required fields for email");
    }

    console.log("Attempting to send email with params:", {
      to: userEmail,
      userName,
      crushName,
    });

    // Log the API key status (safely)
    const hasApiKey = !!Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key status:", hasApiKey ? "Present" : "Missing");

    const emailResponse = await resend.emails.send({
      from: "Secret Crush <onboarding@resend.dev>",
      to: [userEmail],
      subject: "You have a match! 💕",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #e11d48; text-align: center;">Congratulations ${userName}! 🎉</h1>
          <p style="font-size: 18px; line-height: 1.6; text-align: center;">
            Great news! ${crushName} has a crush on you too!
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
            Now that you both know you like each other, why not take the next step?
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Best wishes,<br>
              Your Secret Crush Team 💝
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Detailed error in send-match-email function:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: {
          message: error.message,
          cause: error.cause
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
