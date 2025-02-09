
import { Heart, Loader } from "lucide-react";

const WaitingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="relative">
            <Heart className="w-24 h-24 text-love-500 mx-auto animate-pulse" />
            <Loader className="w-12 h-12 text-trust-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 animate-bounce">Finding Your Match</h1>
          
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            We're keeping your crush a secret! We'll let you know if they feel the same way about you. 🤫
          </p>
          
          <div className="flex justify-center gap-4">
            <span className="animate-bounce delay-0 text-4xl">💝</span>
            <span className="animate-bounce delay-100 text-4xl">💘</span>
            <span className="animate-bounce delay-200 text-4xl">💖</span>
          </div>
          
          <div className="relative pt-4">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-love-200">
              <div className="animate-pulse w-full bg-love-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
