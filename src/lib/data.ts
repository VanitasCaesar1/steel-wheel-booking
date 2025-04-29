
export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  duration: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Oil Change Service",
    description: "Complete oil and filter change using premium synthetic oil to ensure optimal engine performance.",
    price: "$49.99",
    icon: "wrench",
    duration: "45 mins"
  },
  {
    id: 2,
    title: "Brake Inspection & Service",
    description: "Comprehensive brake system inspection and service to ensure safe and responsive braking.",
    price: "$89.99",
    icon: "settings",
    duration: "1 hour"
  },
  {
    id: 3,
    title: "Full Vehicle Inspection",
    description: "Detailed bumper-to-bumper inspection covering all major vehicle systems with digital report.",
    price: "$129.99",
    icon: "list",
    duration: "1.5 hours"
  },
  {
    id: 4,
    title: "Wheel Alignment",
    description: "Precision wheel alignment to improve handling, reduce tire wear, and optimize fuel efficiency.",
    price: "$79.99",
    icon: "settings",
    duration: "1 hour"
  },
  {
    id: 5,
    title: "Air Conditioning Service",
    description: "Complete A/C system inspection, refrigerant recharge, and performance optimization.",
    price: "$119.99",
    icon: "settings",
    duration: "1.5 hours"
  },
  {
    id: 6,
    title: "Major Service Package",
    description: "Comprehensive service including oil change, filters, fluids, brakes, and full inspection.",
    price: "$249.99",
    icon: "wrench",
    duration: "3 hours"
  }
];

export interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  // This would normally connect to a backend to get real availability
  // For demo purposes, we'll generate random availability
  const slots: TimeSlot[] = [];
  const startHour = 8; // 8 AM
  const endHour = 18; // 6 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Add slots for each hour (9:00, 10:00, etc.)
    slots.push({
      id: hour * 2,
      time: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`.replace('0 PM', '12 PM'),
      available: Math.random() > 0.3, // 70% chance of being available
    });
    
    // Add half-hour slots (9:30, 10:30, etc.)
    slots.push({
      id: hour * 2 + 1,
      time: `${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`.replace('0 PM', '12 PM'),
      available: Math.random() > 0.3,
    });
  }
  
  return slots;
};
