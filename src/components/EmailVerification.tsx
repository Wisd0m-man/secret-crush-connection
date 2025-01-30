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

  const handleSendOTP = async () => {
    const generatedOtp = generateOTP();
    setSentOtp(generatedOtp);
    
    // TODO: Add actual email sending logic here
    console.log("Sending OTP:", generatedOtp, "to email:", email);
    
    toast({
      title: "OTP Sent!",
      description: `Check your email (${email}) for the verification code: ${generatedOtp}`,
    });
    setIsVerifying(true);
  };

  const verifyOTP = () => {
    if (otp === sentOtp) {
      toast({
        title: "Email Verified!",
        description: "You can now submit your crush details",
      });
      onVerificationComplete();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the code and try again",
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
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
              ))}
            </InputOTPGroup>
          )}
        />
        <Button 
          type="button" 
          onClick={verifyOTP}
          className="w-full"
          disabled={otp.length !== 6}
        >
          Verify Code
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;