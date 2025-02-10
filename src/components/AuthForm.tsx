import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Sign up the user with auto-confirm enabled
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              email_confirmed: true
            }
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData?.user) {
          // Wait for session to be established
          const { data: session } = await supabase.auth.getSession();
          
          if (session) {
            toast({
              title: "Account created! 🎉",
              description: "Welcome to Secret Crush Matcher!",
            });
            navigate("/crush-form");
          }
        }
      } else {
        // Login flow
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        if (signInData.user) {
          toast({
            title: "Welcome back! 👋",
            description: "Successfully logged in",
          });
          navigate("/crush-form");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please try logging in instead.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.message.includes("valid email")) {
        errorMessage = "Please enter a valid email address.";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      </div>

      {mode === "signup" && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-love-400"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        {mode === "signup" ? (
          <>
            <UserPlus className="w-5 h-5" />
            {isLoading ? "Creating account..." : "Sign Up"}
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            {isLoading ? "Logging in..." : "Log In"}
          </>
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
