import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, AlertTriangle } from "lucide-react";

const LogoutConfirmationDialog = () => {
  const { showLogoutConfirmation, setShowLogoutConfirmation, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleCancel = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <AlertDialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Sign Out Confirmation
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left mt-2">
                Are you sure you want to sign out? You'll need to sign in again to access your stories and account features.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmationDialog;