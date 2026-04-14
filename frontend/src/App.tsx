import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutConfirmationDialog from './components/LogoutConfirmationDialog';

const queryClient = new QueryClient();
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Explore = lazy(() => import('@/pages/Explore'));
const SubmitStory = lazy(() => import('@/pages/SubmitStory'));
const Profile = lazy(() => import('@/pages/Profile'));
const MyStories = lazy(() => import('@/pages/MyStories'));
const EditStory = lazy(() => import('@/pages/EditStory'));
const MapView = lazy(() => import('@/pages/MapView'));
const About = lazy(() => import('@/pages/About'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const ContactUs = lazy(() => import('@/pages/ContactUs'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const TravelPlanner = lazy(() => import('@/pages/TravelPlanner'));
const StoryDetail = lazy(() => import('@/pages/StoryDetail'));

const RouteFallback = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
            <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen">
                <Navigation />
                <LogoutConfirmationDialog />
                <ErrorBoundary>
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute requireAuth={false} redirectTo="/explore">
                            <Index />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <ProtectedRoute requireAuth={false} redirectTo="/explore">
                            <Login />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <ProtectedRoute requireAuth={false} redirectTo="/explore">
                            <Register />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/explore"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <Explore />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-stories"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <MyStories />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/submit"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <SubmitStory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/edit-story/:storyId"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <EditStory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/map"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <MapView />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/plan"
                        element={
                          <ProtectedRoute requireAuth redirectTo="/login">
                            <TravelPlanner />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/story-detail"
                        element={
                          <ProtectedRoute requireAuth={false} redirectTo="/login">
                            <StoryDetail />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/about" element={<About />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
