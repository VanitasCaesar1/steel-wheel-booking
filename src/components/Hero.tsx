
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"
        style={{
          filter: "contrast(120%) brightness(70%)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black"></div>
      
      <div className="absolute inset-0 mix-blend-overlay opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}
      />
      
      <div className="container px-4 z-10 text-center">
        <h1 className={`text-4xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <span className="block mb-2 tracking-tight text-steel-300 drop-shadow-lg">PRECISION</span>
          <span className="block text-white tracking-wider">AUTOMOTIVE <span className="text-steel-300">CARE</span></span>
        </h1>
        
        <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-steel-100 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          Expert mechanics, guaranteed quality, and transparent pricing on all services.
        </p>
        
        <div className={`flex flex-col md:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-steel-300 hover:text-white text-lg px-10 py-6 font-semibold tracking-wide shadow-lg transition-all duration-300"
            onClick={() => document.getElementById("booking")?.scrollIntoView({behavior: "smooth"})}
          >
            BOOK SERVICE
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-steel-300 text-steel-300 hover:bg-steel-300 hover:text-black text-lg px-10 py-6 font-semibold tracking-wide shadow-lg transition-all duration-300"
            onClick={() => document.getElementById("services")?.scrollIntoView({behavior: "smooth"})}
          >
            OUR SERVICES
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 w-full text-center">
        <button 
          onClick={() => document.getElementById("services")?.scrollIntoView({behavior: "smooth"})}
          className="animate-float bg-transparent rounded-full p-2 group transition-all duration-300"
        >
          <ChevronDown size={32} className="text-steel-300 group-hover:text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
