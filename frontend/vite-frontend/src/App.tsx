import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutConfirmationDialog from "./components/LogoutConfirmationDialog";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import SubmitStory from "./pages/SubmitStory";
import Profile from "./pages/Profile";
import MyStories from "./pages/MyStories";
import EditStory from "./pages/EditStory";
import MapView from "./pages/MapView";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <Explore />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-stories" 
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <MyStories />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/submit" 
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <SubmitStory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-story/:storyId" 
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <EditStory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <ProtectedRoute requireAuth={true} redirectTo="/login">
                    <MapView />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
