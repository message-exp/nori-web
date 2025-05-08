import { useEffect, useState } from "react";
import { getCurrentUser } from "~/lib/matrix-api/user"; // 請確保路徑正確
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { ChevronLeft, Loader } from "lucide-react";
import type { User as UserType } from "matrix-js-sdk";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { logout } from "~/lib/matrix-api/logout";

export default function User() {
  const [userData, setUserData] = useState<UserType>();
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const currentUser = await getCurrentUser();
        console.log("Current user data:", currentUser); // 開發調試用
        if (currentUser) {
          setUserData(currentUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUserData(false);
      }
    }

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);
    const success = await logout();
    if (success) {
      console.log("logout successful");
      navigate("/login");
    } else {
      console.log("logout failed");
    }
    setLoadingLogout(false);
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="mb-4">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {loadingUserData ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading user data...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">
              {userData?.rawDisplayName}
            </h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Log out</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>Are you sure to log out?</AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    {loadingLogout ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Yes"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
