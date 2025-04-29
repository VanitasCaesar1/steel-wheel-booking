
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Car, Wrench, Settings, List } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Services = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "car":
        return <Car className="h-10 w-10 text-steel-300" />;
      case "wrench":
        return <Wrench className="h-10 w-10 text-steel-300" />;
      case "settings":
        return <Settings className="h-10 w-10 text-steel-300" />;
      case "list":
        return <List className="h-10 w-10 text-steel-300" />;
      default:
        return <Car className="h-10 w-10 text-steel-300" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-steel-900 text-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">OUR SERVICES</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-steel-300 opacity-30 -z-0"></span>
          </h2>
          <p className="text-lg text-steel-200 max-w-2xl mx-auto">
            We offer a comprehensive range of services to keep your vehicle running at its best.
            All our work comes with a satisfaction guarantee.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className={cn(
                "service-card border-0 border-t-4 border-steel-300 bg-steel-800 hover:bg-steel-700 shadow-xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2",
                visibleItems.includes(index) ? "opacity-100" : "opacity-0 translate-y-10"
              )}
              data-index={index}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-steel-900 p-3 rounded-full">
                    {getIconComponent(service.icon)}
                  </div>
                  <span className="bg-steel-900 text-steel-300 px-4 py-1 rounded-full text-sm font-medium">
                    {service.duration}
                  </span>
                </div>
                <CardTitle className="text-2xl mt-6 text-white">{service.title}</CardTitle>
                <CardDescription className="text-steel-300 text-lg font-medium">
                  Starting from {service.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow text-steel-100">
                <p>{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-steel-300 hover:bg-white text-black hover:text-black font-medium"
                  onClick={() => {
                    document.getElementById("booking")?.scrollIntoView({behavior: "smooth"});
                    // Could set some state here to pre-select this service in the booking form
                  }}
                >
                  Book This Service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
