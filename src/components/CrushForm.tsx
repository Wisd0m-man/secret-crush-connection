
import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { validateEmail, validateUSN } from "@/utils/validationUtils";
import { checkForMatch, updateMatchStatus, type MatchFormData } from "@/utils/matchUtils";

type CrushInsert = Database['public']['Tables']['crushes']['Insert'];

const CrushForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MatchFormData>({
    name: "",
    email: "",
    usn: "",
    crushName: "",
    crushUsn: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

    if (!validateUSN(formData.usn) || !validateUSN(formData.crushUsn)) {
      toast({
        title: "Invalid USN",
        description: "USN must be in format 4VPXXYYZZZ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingSubmission } = await supabase
        .from('crushes')
        .select('*')
        .eq('usn', formData.usn)
        .single();

      if (existingSubmission) {
        toast({
          title: "Already Submitted",
          description: "You have already submitted your crush. Please wait for results.",
          variant: "destructive",
        });
        navigate("/waiting");
        return;
      }

      const crushData: CrushInsert = {
        name: formData.name,
        email: formData.email,
        usn: formData.usn,
        crush_name: formData.crushName,
        crush_usn: formData.crushUsn,
        created_at: new Date().toISOString(),
        status: "pending"
      };

      const { error: insertError } = await supabase
        .from('crushes')
        .insert(crushData);

      if (insertError) {
        console.error("Error inserting crush:", insertError);
        toast({
          title: "Error",
          description: "Failed to submit your crush. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Check for match after successful insertion
      const matchData = await checkForMatch(formData);
      
      if (matchData) {
        await updateMatchStatus(formData.usn, formData.crushUsn);
        navigate("/match-found", { state: { matchData } });
      } else {
        navigate("/waiting");
      }
    } catch (error) {
      console.error("Error submitting crush:", error);
      toast({
        title: "Error",
        description: "Failed to submit your crush. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Heart className="w-16 h-16 text-love-500 mx-auto animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Secret Crush</h1>
          <p className="text-gray-600">We'll let you know if they feel the same way! 💝</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 transition-all duration-200"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 transition-all duration-200"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700">
                Your USN
              </label>
              <input
                id="usn"
                type="text"
                value={formData.usn}
                onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 transition-all duration-200"
                placeholder="4VPXXYYZZZ"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="crushName" className="block text-sm font-medium text-gray-700">
                Your Crush's Name
              </label>
              <input
                id="crushName"
                type="text"
                value={formData.crushName}
                onChange={(e) => setFormData({ ...formData, crushName: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 transition-all duration-200"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="crushUsn" className="block text-sm font-medium text-gray-700">
                Your Crush's USN
              </label>
              <input
                id="crushUsn"
                type="text"
                value={formData.crushUsn}
                onChange={(e) => setFormData({ ...formData, crushUsn: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-love-400 transition-all duration-200"
                placeholder="4VPXXYYZZZ"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-love-500 text-white rounded-lg hover:bg-love-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform transition-transform"
          >
            <Heart className="w-5 h-5 animate-pulse" />
            <span>{isSubmitting ? "Submitting..." : "Submit Secret Crush"}</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrushForm;
