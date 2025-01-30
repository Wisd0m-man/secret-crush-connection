import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
}

const EmailVerification = ({ email, onVerificationComplete }: EmailVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateDuckEmail = (email: string) => {
    return email.toLowerCase().endsWith('@duck.com');
  };

  const handleSendOTP = async () => {
    if (!validateDuckEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid @duck.com email address",
        variant: "destructive",
      });
      return;
    }

    const generatedOtp = generateOTP();
    setSentOtp(generatedOtp);
    
    // In production, this would be an API call to send the email
    console.log("Sending OTP:", generatedOtp, "to email:", email);
    
    toast({
      title: "OTP Sent Successfully! 📧",
      description: `A verification code has been sent to ${email}. For demo purposes, the code is: ${generatedOtp}`,
    });
    setIsVerifying(true);
  };

  const verifyOTP = () => {
    if (otp === sentOtp) {
      toast({
        title: "Email Verified! ✅",
        description: "Your email has been successfully verified",
      });
      onVerificationComplete();
    } else {
      toast({
        title: "Invalid Code ❌",
        description: "The verification code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      setOtp("");
    }
  };

  if (!isVerifying) {
    return (
      <Button 
        type="button" 
        onClick={handleSendOTP}
        className="w-full"
      >
        Send Verification Code
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-gray-500 text-center mb-2">
          Enter the 6-digit code sent to your email
        </div>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot 
                  key={index} 
                  {...slot}
                  className="w-10 h-10 text-center text-lg border-2 focus:border-primary"
                />
              ))}
            </InputOTPGroup>
          )}
        />
        <div className="flex gap-2 w-full">
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              setOtp("");
              handleSendOTP();
            }}
            className="flex-1"
          >
            Resend Code
          </Button>
          <Button 
            type="button" 
            onClick={verifyOTP}
            className="flex-1"
            disabled={otp.length !== 6}
          >
            Verify Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;