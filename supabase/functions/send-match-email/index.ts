
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with explicit error handling
let resend: Resend;
try {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  resend = new Resend(apiKey);
  console.log("Resend initialized successfully");
} catch (error) {
  console.error("Failed to initialize Resend:", error);
  throw error;
}

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
    const requestBody = await req.clone().text();
    console.log("Received request body:", requestBody);
    
    const { userEmail, userName, crushName }: MatchEmailRequest = await req.json();

    // Validate required fields
    if (!userEmail || !userName || !crushName) {
      const error = new Error("Missing required fields for email");
      console.error(error.message, { userEmail, userName, crushName });
      throw error;
    }

    console.log("Preparing to send email with params:", {
      to: userEmail,
      userName,
      crushName,
    });

    try {
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

      console.log("Raw Resend API response:", emailResponse);

      if (!emailResponse || !emailResponse.id) {
        throw new Error("Failed to get valid response from Resend");
      }

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("Resend API error:", {
        error: emailError,
        message: emailError.message,
        cause: emailError.cause,
      });
      throw emailError;
    }
  } catch (error: any) {
    console.error("Detailed error in send-match-email function:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: {
          name: error.name,
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
