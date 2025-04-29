
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Car, Wrench, Settings, List } from "lucide-react";

const Services = () => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "car":
        return <Car className="h-8 w-8 text-steel-300" />;
      case "wrench":
        return <Wrench className="h-8 w-8 text-steel-300" />;
      case "settings":
        return <Settings className="h-8 w-8 text-steel-300" />;
      case "list":
        return <List className="h-8 w-8 text-steel-300" />;
      default:
        return <Car className="h-8 w-8 text-steel-300" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-steel-100">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            We offer a comprehensive range of services to keep your vehicle running at its best.
            All our work comes with a satisfaction guarantee.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border border-steel-200 hover:border-steel-300 transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {getIconComponent(service.icon)}
                  <span className="bg-steel-800 text-white px-3 py-1 rounded-full text-sm">
                    {service.duration}
                  </span>
                </div>
                <CardTitle className="text-xl mt-4">{service.title}</CardTitle>
                <CardDescription className="text-steel-500">
                  Starting from {service.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-steel-600">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-steel-800 hover:bg-black text-white"
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
