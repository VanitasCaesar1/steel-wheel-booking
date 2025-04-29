
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold tracking-tighter">
              STEEL<span className="text-steel-300">WHEEL</span>
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="hover:text-steel-300 transition-colors">Services</a>
            <a href="#booking" className="hover:text-steel-300 transition-colors">Book Now</a>
            <a href="#about" className="hover:text-steel-300 transition-colors">About</a>
            <a href="#contact" className="hover:text-steel-300 transition-colors">Contact</a>
          </nav>
          
          <Button className="hidden md:flex bg-white text-black hover:bg-steel-100">
            Call Now
          </Button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-accordion-down">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#services" 
                className="hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#booking" 
                className="hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Now
              </a>
              <a 
                href="#about" 
                className="hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="hover:text-steel-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Button className="w-full bg-white text-black hover:bg-steel-100">
                Call Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
