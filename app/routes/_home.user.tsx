import { useEffect, useState } from "react";
import { getCurrentUser } from "~/lib/matrix-api/user";
import { useNavigate } from "react-router";
import type { User } from "matrix-js-sdk";
import { checkClientState } from "~/lib/matrix-api/refresh-token";
import UserSettings from "~/components/user-settings";

export default function UserPage() {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const clientState = await checkClientState();
      if (!clientState) {
        console.error("client state is not ok");
        navigate("/login");
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        console.log("Current user data:", currentUser); // debugging log
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  return <UserSettings user={user} />;
}
