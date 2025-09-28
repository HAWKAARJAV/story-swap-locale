import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  const quickLogin = (email: string) => {
    setEmail(email);
    setPassword('password');
    login(email, 'password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Story Swap
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <p className="text-sm text-gray-700 font-semibold text-center">
              Demo Users (Click to Quick Login):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('hawk@example.com')}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg transition-colors"
              >
                🦅 Hawk (Admin)
              </button>
              <button
                onClick={() => quickLogin('aarjav@example.com')}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg transition-colors"
              >
                👨‍💻 Aarjav
              </button>
              <button
                onClick={() => quickLogin('rita@example.com')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg transition-colors"
              >
                ✍️ Rita
              </button>
              <button
                onClick={() => quickLogin('sam@example.com')}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg transition-colors"
              >
                📖 Sam
              </button>
              <button
                onClick={() => quickLogin('anya@example.com')}
                className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-800 px-3 py-2 rounded-lg transition-colors"
              >
                🌸 Anya
              </button>
              <button
                onClick={() => quickLogin('newuser@test.com')}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-colors"
              >
                👤 New User
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center pt-2 border-t">
              Quick login or manually enter any email/password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;