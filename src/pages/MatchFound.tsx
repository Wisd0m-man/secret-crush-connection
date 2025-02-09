
import { Heart, Mail, User } from "lucide-react";
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
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-scale-in">
          <Heart className="w-24 h-24 text-love-500 mx-auto animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-900 mt-4">It's a Match! 💘</h1>
          <p className="text-xl text-gray-600 mt-2">You and your crush like each other!</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-love-500" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">{matchData.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-love-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{matchData.email}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/crush-form")}
            className="w-full mt-6"
          >
            Submit Another Crush
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchFound;
