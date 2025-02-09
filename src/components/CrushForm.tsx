import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoogleAuth from "./GoogleAuth";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { validateEmail, validateUSN } from "@/utils/validationUtils";
import { checkForMatch, sendMatchEmail, updateMatchStatus, type MatchFormData } from "@/utils/matchUtils";

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
        try {
          await sendMatchEmail(formData, matchData);
          await updateMatchStatus(formData.usn, formData.crushUsn);
          
          navigate("/match-found", { state: { matchData } });
        } catch (error) {
          console.error("Error processing match:", error);
          toast({
            title: "Match Found!",
            description: "A match was found but we couldn't send the notification. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        navigate("/waiting");
      }
      
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
    } finally {
      setIsSubmitting(false);
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
            placeholder="4VPXXYYZZZ"
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
            placeholder="4VPXXYYZZZ"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-love-500 text-white rounded-md hover:bg-love-600 transition-colors duration-200"
        >
          <Heart className="w-5 h-5" />
          <span>Submit Secret Crush</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default CrushForm;
