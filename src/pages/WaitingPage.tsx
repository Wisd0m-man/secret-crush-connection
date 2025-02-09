
import { Heart } from "lucide-react";

const WaitingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <Heart className="w-24 h-24 text-love-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Finding Your Match</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          We're keeping your crush a secret! We'll let you know if they feel the same way about you. 🤫
        </p>
        <div className="flex justify-center gap-2">
          <span className="animate-bounce delay-0 text-4xl">💝</span>
          <span className="animate-bounce delay-100 text-4xl">💘</span>
          <span className="animate-bounce delay-200 text-4xl">💖</span>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
