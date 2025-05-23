import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "./Container";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth.slice";
import { clearUser } from "@/store/user.slice";
import { useNavigate } from "react-router-dom";
import authService from "@/services/auth.services";

export function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      if (response) {
        dispatch(logout());
        dispatch(clearUser());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <Container className={"w-full overflow-x-hidden"}>
        <div className="flex h-16 items-center justify-between">
          <Link to="/home" className="flex items-center font-bold">
            CampusFound
          </Link>

          <nav className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {userData.role !== "admin" ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/home">Home</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/items">Items</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button>
                      <Link to="/admin-panel">Admin</Link>
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback>
                        {`${userData ? userData.name.charAt(0) : "U"}`}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {userData.role !== "admin" && (
                      <Link to={`/profile/${userData._id}`}>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                      </Link>
                    )}
                    {/* <DropdownMenuItem>My Reports</DropdownMenuItem> */}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-3">
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
