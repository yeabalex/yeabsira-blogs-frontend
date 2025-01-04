"use client";
import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { ApiClient } from "@/lib/api-client";
import { useDispatch } from "react-redux";
//import { setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { baseURL } from "@/constants/url";

export interface Data {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  //const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiClient = new ApiClient(baseURL);
    try {
      await apiClient.post("/api/v1/register", {
        username,
        email,
        password,
      });
      
      router.push(`/verify?email=${email}`);
    } catch (err) {
      setError(
        (err as Error).message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full dark:bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1DB954] items-center justify-center">
        <div className="p-8">
          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-white/10 animate-[spin_3s_linear_infinite] flex items-center justify-center dark:bg-gray-200/10">
              <div className="w-48 h-48 rounded-full bg-white/20 animate-[spin_4s_linear_infinite] flex items-center justify-center dark:bg-gray-200/20">
                <div className="w-32 h-32 rounded-full bg-white/30 animate-[spin_5s_linear_infinite] dark:bg-gray-200/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign up to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 dark:bg-red-900 dark:border-red-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400 dark:text-red-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1DB954] focus:border-[#1DB954] text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1DB954] focus:border-[#1DB954] text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1DB954] focus:border-[#1DB954] text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters long and contain at
                  least one number
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-[#1DB954] focus:ring-[#1DB954] border-gray-300 rounded dark:border-gray-600"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-[#1DB954] hover:text-[#18a348]"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-[#1DB954] hover:text-[#18a348]"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-[#1DB954] hover:bg-[#18a348] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login">
                <button
                  type="button"
                  className="text-[#1DB954] hover:text-[#18a348]"
                >
                  Sign in
                </button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
