'use client';

import { useState } from 'react';
import { AuthForm, MediaUpload } from '@/components';
import type { AuthFormData } from '@/components';

export default function DemoPage() {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleAuth = async (data: AuthFormData, mode: 'login' | 'register') => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Auth data:', { ...data, mode });
      alert(`${mode === 'login' ? 'Login' : 'Registration'} successful!`);
    } catch {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    console.log('Selected files:', files);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Testing MediaUpload and AuthForm components
          </p>
        </div>

        {/* Auth Form Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Form
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Login and registration with validation
            </p>
          </div>
          
          <div className="flex justify-center">
            <AuthForm
              onSubmit={handleAuth}
              loading={authLoading}
              error={authError}
            />
          </div>
        </section>

        {/* Media Upload Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Media Upload
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop files with preview
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <MediaUpload
              onFilesChange={handleFilesChange}
              maxFiles={3}
              maxSize={5}
              acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'video/mp4']}
            />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected Files ({uploadedFiles.length})
                </h3>
                <ul className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Usage Examples
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                AuthForm
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`<AuthForm
  mode="login"
  onSubmit={handleAuth}
  loading={loading}
  error={error}
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                MediaUpload
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`<MediaUpload
  onFilesChange={handleFiles}
  maxFiles={5}
  maxSize={10}
  acceptedTypes={['image/*']}
/>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}