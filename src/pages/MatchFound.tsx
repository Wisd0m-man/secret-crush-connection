
import { Heart, Mail, User, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MatchFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchData = location.state?.matchData;

  if (!matchData) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8 animate-scale-in">
          <div className="relative inline-block">
            <Heart className="w-24 h-24 text-love-500 animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <span className="animate-bounce text-4xl">💘</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">It's a Match! 💘</h1>
          <p className="text-xl text-gray-600 mt-2">You and your crush like each other!</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 hover:bg-love-50 rounded-lg transition-colors">
              <User className="w-6 h-6 text-love-500" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">{matchData.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 hover:bg-love-50 rounded-lg transition-colors">
              <Mail className="w-6 h-6 text-love-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{matchData.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              onClick={() => navigate("/crush-form")}
              className="w-full bg-love-500 hover:bg-love-600 text-white transition-all duration-200 hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" />
              Submit Another Crush
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full hover:bg-love-50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchFound;
