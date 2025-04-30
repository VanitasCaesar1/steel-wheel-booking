import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CalendarIcon, 
  CarFront, 
  Check, 
  ChevronRight, 
  Clock, 
  Mail, 
  Phone, 
  User,
  Search
} from "lucide-react";
import { services, generateTimeSlots } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { submitBooking } from "@/services/bookingService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const BookingForm = () => {
  // Core state
  const [activeStep, setActiveStep] = useState(1);
  const [date, setDate] = useState();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Hooks
  const { toast: uiToast } = useToast();
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Validation states
  const [errors, setErrors] = useState({
    service: false,
    date: false,
    time: false,
    name: false,
    email: false,
    phone: false
  });

  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
      setSelectedTime(null);
      setErrors({...errors, date: false});
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    const serviceDetails = services.find(s => s.id.toString() === serviceId);
    setSelectedServiceDetails(serviceDetails);
    setErrors({...errors, service: false});
  };

  // Check if step is complete
  const isStepComplete = (step) => {
    switch(step) {
      case 1: return !!selectedService;
      case 2: return !!date && !!selectedTime;
      case 3: return !!name && !!email && !!phone;
      default: return false;
    }
  };

  // Move to next step
  const moveToNextStep = () => {
    if (activeStep === 1 && !selectedService) {
      setErrors({...errors, service: true});
      return;
    }
    
    if (activeStep === 2 && (!date || !selectedTime)) {
      setErrors({...errors, date: !date, time: !selectedTime});
      return;
    }
    
    if (activeStep === 3 && (!name || !email || !phone)) {
      setErrors({...errors, name: !name, email: !email, phone: !phone});
      return;
    }
    
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authState.user) {
      uiToast({
        title: "Login Required",
        description: "Please log in to book a service.",
      });
      navigate("/auth");
      return;
    }
    
    if (!validateAllFields()) return;

    try {
      const result = await submitBooking({
        name, email, phone, serviceId: selectedService,
        date, timeSlot: selectedTime, vehicleInfo
      });

      // Show toast notification
      toast("Booking Request Received!", {
        description: `We've received your booking request for ${format(date, "MMMM d, yyyy")} at ${selectedTime}. We'll contact you shortly to confirm.`,
      });

      // Reset form
      setActiveStep(1);
      setDate(undefined);
      setTimeSlots([]);
      setSelectedTime(null);
      setSelectedService(null);
      setSelectedServiceDetails(null);
      setName("");
      setEmail("");
      setPhone("");
      setVehicleInfo("");
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error", {
        description: "There was an error processing your booking. Please try again.",
      });
      console.error("Booking error:", error);
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      service: !selectedService,
      date: !date,
      time: !selectedTime,
      name: !name,
      email: !email,
      phone: !phone
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Pre-fill user data if logged in
  useEffect(() => {
    if (authState.user?.user_metadata) {
      setName(authState.user.user_metadata.full_name || "");
      setEmail(authState.user.email || "");
    }
  }, [authState.user]);

  // Generate quick date options
  const quickDateOptions = Array.from({ length: 7 }, (_, i) => ({
    date: addDays(new Date(), i + 1),
    label: format(addDays(new Date(), i + 1), "EEE, MMM d")
  }));

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        {/* Header and progress indicators */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Service</h2>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            Schedule your appointment in just a few clicks. 
            Our team will confirm your booking and be ready when you arrive.
          </p>
          
          {/* Progress indicators */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 md:space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => step < activeStep && setActiveStep(step)}
                    disabled={step > activeStep}
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all",
                      activeStep === step 
                        ? "bg-black text-white" 
                        : step < activeStep 
                          ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200" 
                          : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {step < activeStep ? <Check size={16} /> : <span>{step}</span>}
                  </button>
                  {step < 4 && (
                    <div className={cn(
                      "hidden md:block w-12 h-1 mx-1",
                      step < activeStep ? "bg-green-500" : "bg-gray-200"
                    )}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step labels */}
          <div className="flex justify-center mt-2">
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <div className={cn("text-center w-20", 
                activeStep === 1 ? "font-medium text-black" : 
                activeStep > 1 ? "text-green-700" : "text-gray-400"
              )}>Service</div>
              <div className={cn("text-center w-20", 
                activeStep === 2 ? "font-medium text-black" : 
                activeStep > 2 ? "text-green-700" : "text-gray-400"
              )}>Schedule</div>
              <div className={cn("text-center w-20", 
                activeStep === 3 ? "font-medium text-black" : 
                activeStep > 3 ? "text-green-700" : "text-gray-400"
              )}>Details</div>
              <div className={cn("text-center w-20", 
                activeStep === 4 ? "font-medium text-black" : "text-gray-400"
              )}>Confirm</div>
            </div>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto border border-steel-200 shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Service Selection */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Select Your Service</h3>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  
                  {/* Services List - with improved UI */}
                  <div className="space-y-3">                    
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <div 
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id.toString())}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                              selectedService === service.id.toString() 
                                ? "border-black bg-gray-50 ring-2 ring-black ring-opacity-50" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium text-lg">{service.title}</h4>
                                </div>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  {service.duration && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                                      <Clock size={12} className="mr-1" />
                                      {service.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-lg bg-black text-white px-3 py-1 rounded-full">{service.price}</span>
                                {selectedService === service.id.toString() && (
                                  <div className="mt-2 bg-green-100 text-green-600 p-1 rounded-full">
                                    <Check size={16} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No services found matching "{searchQuery}"</p>
                          <Button 
                            variant="link" 
                            onClick={() => setSearchQuery("")}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {errors.service && (
                    <p className="text-red-500 text-sm">Please select a service</p>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={moveToNextStep}
                      className="bg-black hover:bg-steel-800 text-white flex items-center"
                    >
                      Continue to Scheduling
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Date & Time Selection */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Choose Date & Time</h3>
                    {selectedServiceDetails && (
                      <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        <span className="font-medium">{selectedServiceDetails.title}</span>
                        <span className="mx-1">•</span>
                        <span>{selectedServiceDetails.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <Tabs defaultValue="calendar" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="quick">Quick Select</TabsTrigger>
                      <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="quick" className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {quickDateOptions.map((option, idx) => (
                          <Button
                            key={idx}
                            type="button"
                            variant={date && format(date, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd') ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => handleDateSelect(option.date)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="calendar">
                      <div className="flex justify-center mb-4">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {errors.date && (
                    <p className="text-red-500 text-sm">Please select a date</p>
                  )}
                  
                  {date && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center text-lg mb-2">
                          <Clock size={18} className="mr-2 text-gray-500" />
                          <h4 className="font-medium">Available Time Slots</h4>
                        </div>
                        
                        {timeSlots.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.id}
                                type="button"
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                className={cn(
                                  !slot.available
                                    ? "bg-steel-100 text-steel-400 cursor-not-allowed"
                                    : "",
                                  selectedTime === slot.time && "bg-black hover:bg-steel-800"
                                )}
                                disabled={!slot.available}
                                onClick={() => {
                                  setSelectedTime(slot.time);
                                  setErrors({...errors, time: false});
                                }}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Select a date to see available times</p>
                          </div>
                        )}
                        
                        {errors.time && (
                          <p className="text-red-500 text-sm">Please select a time slot</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={moveToNextStep}
                      className="bg-black hover:bg-steel-800 text-white flex items-center"
                    >
                      Continue to Details
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Contact Details */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your Details</h3>
                    {date && selectedTime && (
                      <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {format(date, "MMM d")} • {selectedTime}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User size={16} className="mr-2 text-gray-500" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors({...errors, name: false});
                        }}
                        placeholder="John Smith"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">Please enter your name</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail size={16} className="mr-2 text-gray-500" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({...errors, email: false});
                          }}
                          placeholder="john@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">Please enter your email</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone size={16} className="mr-2 text-gray-500" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setErrors({...errors, phone: false});
                          }}
                          placeholder="+91 4524674890"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">Please enter your phone number</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicle" className="flex items-center">
                        <CarFront size={16} className="mr-2 text-gray-500" />
                        Vehicle Information (optional)
                      </Label>
                      <Input
                        id="vehicle"
                        value={vehicleInfo}
                        onChange={(e) => setVehicleInfo(e.target.value)}
                        placeholder="Year, Make, Model (e.g. 2019 Honda Accord)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveStep(2)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={moveToNextStep}
                      className="bg-black hover:bg-steel-800 text-white flex items-center"
                    >
                      Review Booking
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Confirmation */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Confirm Your Booking</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex justify-between pb-3 border-b">
                        <span className="text-gray-500">Service</span>
                        <span className="font-medium">{selectedServiceDetails?.title}</span>
                      </div>
                      
                      <div className="flex justify-between pb-3 border-b">
                        <span className="text-gray-500">Date & Time</span>
                        <span className="font-medium">
                          {date && format(date, "EEEE, MMMM d, yyyy")} at {selectedTime}
                        </span>
                      </div>
                      
                      <div className="flex justify-between pb-3 border-b">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{name}</span>
                      </div>
                      
                      <div className="flex justify-between pb-3 border-b">
                        <span className="text-gray-500">Contact</span>
                        <div className="text-right">
                          <div className="font-medium">{email}</div>
                          <div>{phone}</div>
                        </div>
                      </div>
                      
                      {vehicleInfo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vehicle</span>
                          <span className="font-medium">{vehicleInfo}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2 text-lg">
                        <span className="font-medium">Price</span>
                        <span className="font-bold">{selectedServiceDetails?.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex">
                    <div className="mr-2">ℹ️</div>
                    <div>
                      Our team will confirm your appointment within 2 hours during business hours.
                      You'll receive a confirmation email and text message.
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveStep(3)}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-black hover:bg-steel-800 text-white"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;