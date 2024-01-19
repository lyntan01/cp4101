import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../wrappers/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../wrappers/ToastProvider";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const { displayToast, ToastType } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      // To handle separately once tested
      displayToast("Successfully logged out!", ToastType.SUCCESS);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      <ArrowRightIcon className="h-6 w-6 shrink-0 text-white" />
    </button>
  );
};
