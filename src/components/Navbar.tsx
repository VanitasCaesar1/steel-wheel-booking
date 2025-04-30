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
    // Only track scroll on non-dashboard pages
    if (!isDashboardPage) {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    }
  };
  
  useEffect(() => {
    // Reset scrolled state when switching between dashboard and main site
    setScrolled(isDashboardPage ? false : window.scrollY > 50);
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDashboardPage]);
  
  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isDashboardPage 
          ? "bg-white border-b border-gray-200 py-3" 
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
                  ? "text-gray-900 group-hover:text-steel-500" 
                  : "text-white group-hover:text-steel-300"
              )}>GLOW </span>
              <span className={cn(
                "transition-colors duration-300",
                isDashboardPage 
                  ? "text-steel-500" 
                  : "text-white group-hover:text-steel-300"
              )}>&</span>
              <span className={cn(
                "transition-colors duration-300",
                isDashboardPage 
                  ? "text-gray-900 group-hover:text-gray-900" 
                  : "text-steel-300 group-hover:text-white"
              )}> GO </span>
            </Link>
            {isDashboardPage && (
              <span className="ml-3 text-xs font-medium py-1 px-2 bg-gray-100 text-gray-600 rounded-md">Dashboard</span>
            )}
          </div>
          
          {/* Desktop & Tablet Navigation - Show from medium breakpoint up */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <a 
              href={isDashboardPage ? "/services" : "/#services"} 
              className={cn(
                "transition-all duration-300 relative group text-sm lg:text-base",
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
                "transition-all duration-300 relative group text-sm lg:text-base",
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
                "transition-all duration-300 relative group text-sm lg:text-base",
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
                "transition-all duration-300 relative group text-sm lg:text-base",
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
          
          {/* Desktop & Tablet Actions - Show from medium breakpoint up */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {authState.user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isDashboardPage ? "outline" : "secondary"}
                    size="sm"
                    className={cn(
                      "text-xs lg:text-sm",
                      isDashboardPage 
                        ? "text-gray-700 border-gray-700 hover:bg-gray-700 hover:text-white" 
                        : "bg-steel-300/20 text-steel-300 border border-steel-300 hover:bg-steel-300 hover:text-black"
                    )}
                  >
                    <User className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="whitespace-nowrap">Dashboard</span>
                  </Button>
                </Link>
                {isDashboardPage && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Sign out logic */}}
                    className="text-xs lg:text-sm text-gray-700 hover:text-steel-500 hover:bg-transparent"
                  >
                    Sign Out
                  </Button>
                )}
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant={isDashboardPage ? "outline" : "secondary"}
                  size="sm"
                  className={cn(
                    "text-xs lg:text-sm",
                    isDashboardPage 
                      ? "text-gray-700 border-gray-700 hover:bg-gray-700 hover:text-white" 
                      : "bg-steel-300/20 text-steel-300 border border-steel-300 hover:bg-steel-300 hover:text-black"
                  )}
                >
                  <User className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="whitespace-nowrap">Sign In</span>
                </Button>
              </Link>
            )}
            
            <Button 
              size="sm"
              className={cn(
                "flex items-center gap-1 lg:gap-2 text-xs lg:text-sm transition-all duration-300",
                isDashboardPage 
                  ? "bg-steel-500 text-white hover:bg-steel-600" 
                  : "bg-steel-300 text-black hover:bg-white hover:text-steel-500"
              )}
            >
              <Phone size={16} /> <span className="whitespace-nowrap">Call Now</span>
            </Button>
          </div>
          
          {/* Mobile Menu Button - Hide from medium breakpoint up */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all",
              isDashboardPage 
                ? "text-gray-700 hover:bg-gray-200" 
                : "text-white hover:bg-white/10"
            )}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu - Hide from medium breakpoint up */}
        <div 
          id="mobile-menu"
          className={cn(
            "md:hidden fixed inset-0 z-40 transition-all duration-300",
            isMenuOpen 
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          )}
          aria-hidden={!isMenuOpen}
          style={{ marginTop: 0 }} // Ensure no unexpected margin
        >
          {/* Backdrop */}
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              isDashboardPage ? "bg-gray-900/50" : "bg-black/50",
              "backdrop-blur-sm",
              isMenuOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div 
            className={cn(
              "absolute top-0 right-0 h-full w-4/5 max-w-sm transform transition-transform duration-300 ease-in-out shadow-xl",
              isDashboardPage ? "bg-white" : "bg-black/95",
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className={cn(
                "sticky top-0 flex justify-between items-center p-6 border-b",
                isDashboardPage ? "border-gray-200 bg-white" : "border-gray-800 bg-black/95" 
              )}>
                <span className={cn(
                  "font-semibold",
                  isDashboardPage ? "text-gray-900" : "text-white"
                )}>
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                    isDashboardPage 
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-white hover:bg-white/10"
                  )}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-6 px-6">
                <div className="flex flex-col space-y-1">
                  {isDashboardPage ? (
                    // Dashboard Navigation Items
                    <>
                      <NavItem 
                        href="/dashboard"
                        label="Dashboard Home"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                        active={location.pathname === "/dashboard"}
                      />
                      <NavItem 
                        href="/dashboard/appointments"
                        label="My Appointments"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                        active={location.pathname.includes("/appointments")}
                      />
                      <NavItem 
                        href="/dashboard/profile"
                        label="Profile Settings"  
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                        active={location.pathname.includes("/profile")}
                      />
                    </>
                  ) : (
                    // Main Site Navigation Items
                    <>
                      <NavItem 
                        href="/#services"
                        label="Services"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                      />
                      <NavItem 
                        href="/#booking"
                        label="Book Now"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                      />
                      <NavItem 
                        href="/#about"
                        label="About"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                      />
                      <NavItem 
                        href="/#contact"
                        label="Contact"
                        isDashboardPage={isDashboardPage}
                        onClick={closeMenu}
                      />
                    </>
                  )}
                </div>
                
                {/* Auth Section */}
                <div className={cn(
                  "mt-8 pt-6 border-t",
                  isDashboardPage ? "border-gray-200" : "border-gray-800"
                )}>
                  {isDashboardPage ? (
                    // Dashboard Auth Section
                    <div className="space-y-4">
                      {/* Switch to Main Site */}
                      <Link 
                        to="/"
                        className="block w-full py-3 px-4 rounded-lg font-medium text-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        onClick={closeMenu}
                      >
                        Return to Main Site
                      </Link>
                      
                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          /* Sign out logic */
                          closeMenu();
                        }}
                        className="block w-full py-3 px-4 rounded-lg font-medium text-center border border-gray-200 text-gray-700 hover:text-steel-500 hover:border-steel-500 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    // Main Site Auth Section
                    authState.user ? (
                      <div className="space-y-4">
                        <Link 
                          to="/dashboard"
                          className="block w-full py-3 px-4 rounded-lg font-medium text-center transition-colors bg-gray-800 text-steel-300 hover:bg-gray-700"
                          onClick={closeMenu}
                        >
                          <User className="inline-block mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </div>
                    ) : (
                      <Link 
                        to="/auth"
                        className="block w-full py-3 px-4 rounded-lg font-medium text-center transition-colors bg-gray-800 text-steel-300 hover:bg-gray-700"
                        onClick={closeMenu}
                      >
                        <User className="inline-block mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    )
                  )}
                </div>
              </nav>
              
              {/* Call Now Button - Fixed at Bottom */}
              <div className="p-6 pt-0 border-t border-gray-200 shadow-inner">
                {isDashboardPage ? (
                  <Button 
                    className="w-full py-4 flex items-center justify-center gap-2 text-base bg-steel-500 text-white hover:bg-steel-600"
                  >
                    <Phone size={18} /> Call Support
                  </Button>
                ) : (
                  <Button 
                    className="w-full py-4 flex items-center justify-center gap-2 text-base bg-steel-300 text-black hover:bg-white hover:text-steel-500"
                  >
                    <Phone size={18} /> Call Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile Nav Item Component
const NavItem = ({ href, label, isDashboardPage, onClick, active = false }) => {
  return (
    <a 
      href={href}
      className={cn(
        "block w-full py-3 px-4 rounded-lg transition-colors",
        isDashboardPage 
          ? active
            ? "bg-gray-100 text-steel-500 font-medium"
            : "text-gray-700 hover:bg-gray-50 hover:text-steel-500" 
          : "text-white hover:bg-white/5 hover:text-steel-300"
      )}
      onClick={onClick}
    >
      {label}
    </a>
  );
};

export default Navbar;