
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contact" className="bg-steel-900 text-white">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              STEEL<span className="text-steel-300">WHEEL</span>
            </h3>
            <p className="text-steel-300 mb-4">
              Premium automotive care without the premium price. Certified mechanics and transparent service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-steel-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-steel-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-steel-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-steel-300 hover:text-white transition-colors">Services</a></li>
              <li><a href="#booking" className="text-steel-300 hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#about" className="text-steel-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">Oil Change</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">Brake Service</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">Wheel Alignment</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">A/C Service</a></li>
              <li><a href="#" className="text-steel-300 hover:text-white transition-colors">Major Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Service Road</p>
              <p className="mb-2">Cartown, CT 12345</p>
              <p className="mb-2">
                <a href="tel:+15551234567" className="text-steel-300 hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </p>
              <p className="mb-4">
                <a href="mailto:info@steelwheel.com" className="text-steel-300 hover:text-white transition-colors">
                  info@steelwheel.com
                </a>
              </p>
              <p className="mb-2">
                <strong>Hours:</strong> Mon-Fri: 8am-6pm
              </p>
              <p>Sat: 9am-4pm, Sun: Closed</p>
            </address>
          </div>
        </div>
        
        <hr className="border-steel-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-steel-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SteelWheel Auto Service. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-steel-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-steel-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-steel-400 hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
