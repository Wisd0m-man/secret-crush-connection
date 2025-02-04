import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoogleAuth from "./GoogleAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
  usn: string;
  crushName: string;
  crushUsn: string;
}

const CrushForm = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    usn: "",
    crushName: "",
    crushUsn: "",
  });

  const validateUSN = (usn: string) => {
    // Format: 4VP + 2 digits + 2 letters + 3 digits
    const usnRegex = /^4VP\d{2}[A-Z]{2}\d{3}$/;
    return usnRegex.test(usn);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.usn || !formData.crushName || !formData.crushUsn) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateUSN(formData.usn)) {
      toast({
        title: "Invalid USN",
        description: "USN must be in format 4VPXXYYZZZ (XX=2 digits, YY=2 letters, ZZZ=3 digits)",
        variant: "destructive",
      });
      return;
    }

    if (!validateUSN(formData.crushUsn)) {
      toast({
        title: "Invalid Crush's USN",
        description: "USN must be in format 4VPXXYYZZZ (XX=2 digits, YY=2 letters, ZZZ=3 digits)",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate with Google before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add data to Firestore
      await addDoc(collection(db, "crushes"), {
        ...formData,
        createdAt: new Date(),
        status: "pending" // Can be used later for matching logic
      });

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
    } catch (error) {
      console.error("Error submitting crush:", error);
      toast({
        title: "Error",
        description: "Failed to submit your crush. Please try again.",
        variant: "destructive",
      });
    }
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

        {!isAuthenticated ? (
          <div className="pt-4">
            <GoogleAuth onAuthComplete={() => setIsAuthenticated(true)} />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-love-500 text-white rounded-md hover:bg-love-600 transition-colors duration-200"
          >
            <Heart className="w-5 h-5" />
            <span>Submit Secret Crush</span>
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default CrushForm;