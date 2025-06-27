import { useState, useRef, useEffect } from "react";
import { Menu, User, Search, MapPin } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ThemeSelector from "./ThemeSelector";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Store/AuthSlice";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Packages", href: "/packages" },
  { name: "Hotels", href: "/hotels" },
  { name: "Flights", href: "/flights" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const userIconRef = useRef(null);


  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !userIconRef.current.contains(event.target) &&
        isUserDropdownOpen
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserDropdownOpen]);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      console.log("Error occured at Logout UI");
    }
  };

  const UserDropdown = ({ isLoggedIn }) => {
    return (
      <div
        ref={profileDropdownRef}
        className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200"
      >
        <div className="py-1">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    );
  };

  const MobileMenu = () => {
    return (
      <div
        ref={sidebarRef}
        className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50"
      >
        <div className="p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="ml-auto block p-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="mt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 border-gray-300 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="max-w-screen-2xl mx-auto">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                Luxury Travels
              </span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-semibold text-gray-600 transition-colors hover:text-primary`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="mr-1 p-2 bg-transparent border-none cursor-pointer"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
            <ThemeToggle />
            <ThemeSelector />
            <div className="relative">
              <button
                ref={userIconRef}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="p-2 bg-transparent border-none cursor-pointer"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User</span>
              </button>
              {isUserDropdownOpen && <UserDropdown isLoggedIn={false} />}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 bg-transparent border-none cursor-pointer"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="container py-4 border-t border-gray-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search destinations, hotels, packages..."
                className="w-full border-gray-400 rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}
        {isMobileMenuOpen && <MobileMenu />}
      </div>
    </header>
  );
}
