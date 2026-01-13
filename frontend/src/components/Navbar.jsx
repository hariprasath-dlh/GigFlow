import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 fixed w-full z-10 top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/gigs" className="text-white font-bold text-xl">
              GigFlow
            </Link>
          </div>

          {/* Links */}
          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/gigs"
                className="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Gigs
              </Link>

              <Link
                to="/gigs/create"
                className="text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Create Gig
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
