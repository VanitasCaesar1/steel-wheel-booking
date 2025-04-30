import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Wrench, Calendar } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: "url('/public/11.jpg')",
          filter: "contrast(120%) brightness(70%)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black"></div>
      <div
        className="absolute inset-0 mix-blend-overlay opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}
      />
      <div className="container px-4 z-10 text-center">
        <h1 className={`text-4xl md:text-7xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <span className="block mb-1 md:mb-2 tracking-tight text-steel-300 drop-shadow-lg">PRECISION</span>
          <span className="block text-white tracking-wider">AUTOMOTIVE <span className="text-steel-300">CARE</span></span>
        </h1>
        <p className={`text-lg md:text-2xl max-w-2xl mx-auto mb-8 md:mb-10 text-steel-100 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          Expert mechanics, guaranteed quality, and transparent pricing on all services.
        </p>
        <div className={`flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => scrollToSection("booking")}
            className="group relative flex items-center justify-center gap-2 bg-steel-300 text-black hover:bg-white text-lg px-6 py-4 md:px-8 rounded-lg font-semibold tracking-wide shadow-xl transform transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-steel-300"
          >
            <Calendar size={20} className="transition-transform group-hover:scale-110" />
            <span className="relative z-10">BOOK SERVICE</span>
            <span className="absolute bottom-0 left-0 h-1 w-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="group relative flex items-center justify-center gap-2 border-2 border-steel-300 text-steel-300 hover:border-white hover:text-white text-lg px-6 py-4 md:px-8 rounded-lg font-semibold tracking-wide shadow-xl transform transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-steel-300"
          >
            <Wrench size={20} className="transition-transform group-hover:scale-110" />
            <span className="relative z-10">OUR SERVICES</span>
            <span className="absolute inset-0 bg-steel-300/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 w-full text-center">
        <button
          onClick={() => scrollToSection("services")}
          className="animate-bounce bg-transparent rounded-full p-2 group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-steel-300 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Scroll to services section"
        >
          <ChevronDown size={32} className="text-steel-300 group-hover:text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;