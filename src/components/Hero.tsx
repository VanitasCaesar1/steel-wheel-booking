
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
      <div className="container px-4 z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Premium Car Service <br className="hidden md:block" />
          <span className="text-steel-300">Without The Premium Price</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-steel-100">
          Expert mechanics, guaranteed quality, and transparent pricing on all services.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-steel-100 text-lg px-8"
            onClick={() => document.getElementById("booking")?.scrollIntoView({behavior: "smooth"})}
          >
            Book Service
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-steel-300 text-steel-300 hover:bg-steel-900 text-lg px-8"
            onClick={() => document.getElementById("services")?.scrollIntoView({behavior: "smooth"})}
          >
            Our Services
          </Button>
        </div>
      </div>
      <div className="absolute bottom-8 w-full text-center">
        <button 
          onClick={() => document.getElementById("services")?.scrollIntoView({behavior: "smooth"})}
          className="animate-bounce bg-steel-900 rounded-full p-2"
        >
          <ChevronDown size={24} className="text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
