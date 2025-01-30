import CrushForm from "@/components/CrushForm";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block animate-float">
            <Heart className="w-16 h-16 text-love-500 mb-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Secret Crush Matcher
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Found someone special? Let us help you discover if they feel the same way.
            Your secret is safe with us! 🤫
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-love-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-love-500 font-semibold">1</span>
                  </div>
                  <p className="text-gray-600">Enter your details and your crush's information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-love-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-love-500 font-semibold">2</span>
                  </div>
                  <p className="text-gray-600">We'll keep your submission completely confidential</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-love-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-love-500 font-semibold">3</span>
                  </div>
                  <p className="text-gray-600">If they submit your name too, it's a match! 💘</p>
                </div>
              </div>
            </div>
            
            <CrushForm />
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Your privacy is our priority. All submissions are encrypted and confidential.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;