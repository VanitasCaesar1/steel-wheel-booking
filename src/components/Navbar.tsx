
import { useState, useEffect } from "react";
import { Menu, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authState } = useAuth();
  
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
        scrolled ? "bg-black/95 shadow-md py-2" : "bg-black/10 py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter group transition-all duration-300">
              <span className="text-white group-hover:text-steel-300 transition-colors duration-300">STEEL</span>
              <span className="text-steel-300 group-hover:text-white transition-colors duration-300">WHEEL</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/#services" className="text-white hover:text-steel-300 transition-all duration-300 relative group">
              <span className="group-hover:animate-pulse-subtle">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-steel-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#booking" className="text-white hover:text-steel-300 transition-all duration-300 relative group">
              <span className="group-hover:animate-pulse-subtle">Book Now</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-steel-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#about" className="text-white hover:text-steel-300 transition-all duration-300 relative group">
              <span className="group-hover:animate-pulse-subtle">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-steel-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#contact" className="text-white hover:text-steel-300 transition-all duration-300 relative group">
              <span className="group-hover:animate-pulse-subtle">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-steel-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            {authState.user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button className="flex items-center gap-2 bg-steel-300 text-black hover:bg-white transition-all duration-300">
              <Phone size={18} /> Call Now
            </Button>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white z-50"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/95 z-40 pt-20 animate-slide-in">
            <nav className="flex flex-col space-y-8 p-8 text-center">
              <a 
                href="/#services" 
                className="text-xl font-medium text-white hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="/#booking" 
                className="text-xl font-medium text-white hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </a>
              <a 
                href="/#about" 
                className="text-xl font-medium text-white hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="/#contact" 
                className="text-xl font-medium text-white hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              
              {authState.user ? (
                <Link 
                  to="/dashboard"
                  className="text-xl font-medium text-steel-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/auth"
                  className="text-xl font-medium text-steel-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              
              <Button 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-steel-300 text-black hover:bg-white"
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
