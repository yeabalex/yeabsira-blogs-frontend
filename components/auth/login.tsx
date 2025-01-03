'use client'
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { baseURL } from '@/constants/url';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/userSlice';
import { Data } from './register';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const apiClient = new ApiClient(baseURL);
    try {
      const res = await apiClient.post("/api/v1/login", {
        email,
        password,
      });
      const data = res.data as Data;
      dispatch(setUser(data));
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
      router.push("/");
    } catch (err) {
      console.log("No woman")
      console.log(err)
      setError(
        (err as Error).message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1DB954] items-center justify-center">
        <div className="p-8">
          <div className="w-64 h-64 rounded-full bg-white/10 animate-pulse flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back to Yeabsira Blogs</h2>
            <p className="text-gray-600">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1DB954] focus:border-[#1DB954] text-gray-900"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#1DB954] focus:border-[#1DB954] text-gray-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#1DB954] focus:ring-[#1DB954] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-[#1DB954] hover:text-[#18a348]">
                Forgot password?
              </button>
            </div>
          
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-[#1DB954] hover:bg-[#18a348] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Hold up...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register">
              <button type="button" className="text-[#1DB954] hover:text-[#18a348]">
                Sign up
              </button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;