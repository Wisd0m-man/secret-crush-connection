
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import AuthForm from "@/components/AuthForm";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-100 via-white to-trust-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block animate-bounce">
            <Heart className="w-16 h-16 text-love-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            {mode === "login" ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === "login"
              ? "Log in to find your secret match"
              : "Sign up to start finding your secret match"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl">
          <AuthForm mode={mode} />
          
          <div className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-love-500 hover:text-love-600 font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-love-500 hover:text-love-600 font-medium"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
