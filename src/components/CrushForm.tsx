import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailVerification from "./EmailVerification";

interface FormData {
  name: string;
  email: string;
  usn: string;
  crushName: string;
  crushUsn: string;
}

const CrushForm = () => {
  const { toast } = useToast();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    usn: "",
    crushName: "",
    crushUsn: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUSN = (usn: string) => {
    // This regex will match any USN that follows the pattern XVPXXXX0XX where X can be any digit
    const usnRegex = /^\dVP\d{4}0\d{2}$/;
    return usnRegex.test(usn);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.name || !formData.email || !formData.usn || !formData.crushName || !formData.crushUsn) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateUSN(formData.usn)) {
      toast({
        title: "Invalid USN",
        description: "USN must be in format XVP****0**",
        variant: "destructive",
      });
      return;
    }

    if (!validateUSN(formData.crushUsn)) {
      toast({
        title: "Invalid Crush's USN",
        description: "USN must be in format XVP****0**",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email before submitting",
        variant: "destructive",
      });
      return;
    }

    // TODO: Add Supabase submission logic here
    toast({
      title: "Crush Submitted! 💘",
      description: "We'll let you know if it's a match!",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      usn: "",
      crushName: "",
      crushUsn: "",
    });
    setIsEmailVerified(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="john@example.com"
          />
          {validateEmail(formData.email) && !isEmailVerified && (
            <EmailVerification 
              email={formData.email} 
              onVerificationComplete={() => setIsEmailVerified(true)} 
            />
          )}
        </div>
        
        <div>
          <label htmlFor="usn" className="block text-sm font-medium text-gray-700 mb-1">
            Your USN
          </label>
          <input
            id="usn"
            type="text"
            value={formData.usn}
            onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="1VP****0**"
          />
        </div>

        <div>
          <label htmlFor="crushName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Crush's Name
          </label>
          <input
            id="crushName"
            type="text"
            value={formData.crushName}
            onChange={(e) => setFormData({ ...formData, crushName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="crushUsn" className="block text-sm font-medium text-gray-700 mb-1">
            Your Crush's USN
          </label>
          <input
            id="crushUsn"
            type="text"
            value={formData.crushUsn}
            onChange={(e) => setFormData({ ...formData, crushUsn: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="1VP****0**"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isEmailVerified}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-love-500 text-white rounded-md hover:bg-love-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart className="w-5 h-5" />
        <span>Submit Secret Crush</span>
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default CrushForm;