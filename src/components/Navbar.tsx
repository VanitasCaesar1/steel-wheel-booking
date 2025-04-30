import { useState, useEffect } from "react";
import { Menu, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authState } = useAuth();
  const location = useLocation();
  
  // Determine if we're on a dashboard or authenticated page
  const isDashboardPage = location.pathname.includes('/dashboard');
  
  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isDashboardPage 
          ? "bg-gray-100 py-3" 
          : scrolled 
            ? "bg-black/95 shadow-md py-2" 
            : "bg-black/10 py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter group transition-all duration-300">
              <span className={cn(
                "transition-colors duration-300",
                isDashboardPage 
                  ? "text-black group-hover:text-steel-500" 
                  : "text-white group-hover:text-steel-300"
              )}>STEEL</span>
              <span className={cn(
                "transition-colors duration-300",
                isDashboardPage 
                  ? "text-steel-500 group-hover:text-black" 
                  : "text-steel-300 group-hover:text-white"
              )}>WHEEL</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a 
              href={isDashboardPage ? "/services" : "/#services"} 
              className={cn(
                "transition-all duration-300 relative group",
                isDashboardPage 
                  ? "text-gray-700 hover:text-steel-500" 
                  : "text-white hover:text-steel-300"
              )}
            >
              <span className="group-hover:animate-pulse-subtle">Services</span>
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                isDashboardPage ? "bg-steel-500" : "bg-steel-300"
              )}></span>
            </a>
            <a 
              href={isDashboardPage ? "/book-now" : "/#booking"} 
              className={cn(
                "transition-all duration-300 relative group",
                isDashboardPage 
                  ? "text-gray-700 hover:text-steel-500" 
                  : "text-white hover:text-steel-300"
              )}
            >
              <span className="group-hover:animate-pulse-subtle">Book Now</span>
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                isDashboardPage ? "bg-steel-500" : "bg-steel-300"
              )}></span>
            </a>
            <a 
              href={isDashboardPage ? "/about" : "/#about"} 
              className={cn(
                "transition-all duration-300 relative group",
                isDashboardPage 
                  ? "text-gray-700 hover:text-steel-500" 
                  : "text-white hover:text-steel-300"
              )}
            >
              <span className="group-hover:animate-pulse-subtle">About</span>
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                isDashboardPage ? "bg-steel-500" : "bg-steel-300"
              )}></span>
            </a>
            <a 
              href={isDashboardPage ? "/contact" : "/#contact"} 
              className={cn(
                "transition-all duration-300 relative group",
                isDashboardPage 
                  ? "text-gray-700 hover:text-steel-500" 
                  : "text-white hover:text-steel-300"
              )}
            >
              <span className="group-hover:animate-pulse-subtle">Contact</span>
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                isDashboardPage ? "bg-steel-500" : "bg-steel-300"
              )}></span>
            </a>
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            {authState.user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isDashboardPage ? "outline" : "secondary"}
                    className={cn(
                      isDashboardPage 
                        ? "text-gray-700 border-gray-700 hover:bg-gray-700 hover:text-white" 
                        : "bg-steel-300/20 text-steel-300 border border-steel-300 hover:bg-steel-300 hover:text-black"
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                {isDashboardPage && (
                  <Button 
                    variant="ghost"
                    onClick={() => {/* Sign out logic */}}
                    className="text-gray-700 hover:text-steel-500 hover:bg-transparent"
                  >
                    Sign Out
                  </Button>
                )}
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant={isDashboardPage ? "outline" : "secondary"}
                  className={cn(
                    isDashboardPage 
                      ? "text-gray-700 border-gray-700 hover:bg-gray-700 hover:text-white" 
                      : "bg-steel-300/20 text-steel-300 border border-steel-300 hover:bg-steel-300 hover:text-black"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button 
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                isDashboardPage 
                  ? "bg-steel-500 text-white hover:bg-steel-600" 
                  : "bg-steel-300 text-black hover:bg-white hover:text-steel-500"
              )}
            >
              <Phone size={18} /> Call Now
            </Button>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden z-50",
              isDashboardPage ? "text-gray-700" : "text-white"
            )}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className={cn(
            "md:hidden fixed inset-0 z-40 pt-20 animate-slide-in",
            isDashboardPage ? "bg-white/95" : "bg-black/95"
          )}>
            <nav className="flex flex-col space-y-8 p-8 text-center">
              <a 
                href={isDashboardPage ? "/services" : "/#services"}
                className={cn(
                  "text-xl font-medium transition-colors",
                  isDashboardPage 
                    ? "text-gray-700 hover:text-steel-500" 
                    : "text-white hover:text-steel-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href={isDashboardPage ? "/book-now" : "/#booking"}
                className={cn(
                  "text-xl font-medium transition-colors",
                  isDashboardPage 
                    ? "text-gray-700 hover:text-steel-500" 
                    : "text-white hover:text-steel-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </a>
              <a 
                href={isDashboardPage ? "/about" : "/#about"}
                className={cn(
                  "text-xl font-medium transition-colors",
                  isDashboardPage 
                    ? "text-gray-700 hover:text-steel-500" 
                    : "text-white hover:text-steel-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href={isDashboardPage ? "/contact" : "/#contact"}
                className={cn(
                  "text-xl font-medium transition-colors",
                  isDashboardPage 
                    ? "text-gray-700 hover:text-steel-500" 
                    : "text-white hover:text-steel-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              
              {authState.user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className={cn(
                      "text-xl font-medium transition-colors",
                      isDashboardPage 
                        ? "text-steel-500 hover:text-gray-700" 
                        : "text-steel-300 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isDashboardPage && (
                    <button
                      onClick={() => {
                        /* Sign out logic */
                        setIsMenuOpen(false);
                      }}
                      className="text-xl font-medium text-gray-700 hover:text-steel-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </>
              ) : (
                <Link 
                  to="/auth"
                  className={cn(
                    "text-xl font-medium transition-colors",
                    isDashboardPage 
                      ? "text-steel-500 hover:text-gray-700" 
                      : "text-steel-300 hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              
              <Button 
                className={cn(
                  "w-full mt-4 flex items-center justify-center gap-2",
                  isDashboardPage 
                    ? "bg-steel-500 text-white hover:bg-steel-600" 
                    : "bg-steel-300 text-black hover:bg-white hover:text-steel-500"
                )}
              >
                <Phone size={18} /> Call Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;