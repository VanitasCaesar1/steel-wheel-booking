import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Car, Wrench, Settings, List, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Services = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => [
            ...prev, 
            parseInt(entry.target.getAttribute('data-index') || "-1")
          ]);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.service-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "car":
        return <Car className="h-8 w-8" />;
      case "wrench":
        return <Wrench className="h-8 w-8" />;
      case "settings":
        return <Settings className="h-8 w-8" />;
      case "list":
        return <List className="h-8 w-8" />;
      default:
        return <Car className="h-8 w-8" />;
    }
  };

  return (
    <section id="services" className="py-24 m-8 rounded-2xl bg-black text-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-20">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">OUR SERVICES</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-white opacity-10 -z-0"></span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We offer a comprehensive range of services to keep your vehicle running at its best.
            All our work comes with a satisfaction guarantee.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className={cn(
                "service-card border-0 shadow-xl transition-all duration-500 h-full flex flex-col transform",
                visibleItems.includes(index) ? "opacity-100" : "opacity-0 translate-y-10",
                hoveredCard === index ? "scale-105" : "hover:scale-102"
              )}
              data-index={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === index ? "#111111" : "#0a0a0a",
                borderRadius: "12px",
                boxShadow: hoveredCard === index 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" 
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white rounded-t-lg"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className={cn(
                      "p-4 rounded-lg transition-all duration-300",
                      hoveredCard === index ? "bg-white text-black" : "bg-zinc-900 text-white"
                    )}
                  >
                    {getIconComponent(service.icon)}
                  </div>
                  <span className="bg-zinc-900 text-zinc-400 px-4 py-1 rounded-full text-sm font-medium border border-zinc-800">
                    {service.duration}
                  </span>
                </div>
                <CardTitle className="text-2xl mt-4 text-white">{service.title}</CardTitle>
                <CardDescription className="text-zinc-400 text-xl font-medium mt-2">
                  Starting from <span className="text-white font-bold">{service.price}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow text-zinc-300 pt-2">
                <p>{service.description}</p>
                
               
              </CardContent>
              
              <CardFooter className="pt-4">
                <Button 
                  className={cn(
                    "w-full group transition-all duration-300 font-medium flex items-center justify-center gap-2",
                    hoveredCard === index 
                      ? "bg-white text-black hover:bg-zinc-200" 
                      : "bg-zinc-900 text-white hover:bg-white hover:text-black"
                  )}
                  onClick={() => {
                    document.getElementById("booking")?.scrollIntoView({behavior: "smooth"});
                  }}
                >
                  Book This Service
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform",
                    hoveredCard === index ? "translate-x-1" : "group-hover:translate-x-1"
                  )} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button 
            className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg font-medium"
            onClick={() => {
              document.getElementById("booking")?.scrollIntoView({behavior: "smooth"});
            }}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;