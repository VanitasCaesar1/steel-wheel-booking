import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-24 m-8 rounded-2xl bg-black text-white">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-px w-12 bg-white mr-4"></div>
              <span className="text-sm uppercase tracking-wider text-gray-400">About Us</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-8">
              Expert Car Service <span className="text-gray-400">You Can Trust</span>
            </h2>
            
            <p className="text-gray-300 mb-6 text-lg">
              Glow and Go is providing premium automotive care with professional 
              grade quality and service. Our team of certified mechanics and 
              experts are dedicated to keeping your vehicle running at its best.
            </p>
            
            <p className="text-gray-300 mb-8 text-lg">
              We believe in complete transparency and honest service. That's why we provide detailed 
              explanations of all work performed and only recommend services your vehicle actually needs.
            </p>
            
            <div className="border border-gray-800 rounded-lg p-6 bg-black bg-opacity-60">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-4"></div>
                  <span className="text-gray-200">Certified master mechanics</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-4"></div>
                  <span className="text-gray-200">State-of-the-art diagnostic equipment</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-4"></div>
                  <span className="text-gray-200">Genuine or OEM-quality parts</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-4"></div>
                  <span className="text-gray-200">12-month/12,000-mile warranty on all services</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-8">
              <div className="h-px w-12 bg-white mr-4"></div>
              <h3 className="text-2xl font-bold">What Our Customers Say</h3>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gray-900 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-white fill-current" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">
                    "The team at Glow and Go is exceptional. They fixed my car 
                    quickly and at a reasonable price. I appreciate their honesty 
                    and clear explanations of the work needed."
                  </p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="font-medium text-sm">P</span>
                    </div>
                    <p className="font-medium ml-3">Priya Mohini</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-white fill-current" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">
                    "I've been taking my vehicles to Glow and Go for years. Their online 
                    booking system makes scheduling easy, and their service is always 
                    top-notch. Highly recommend!"
                  </p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="font-medium text-sm">J</span>
                    </div>
                    <p className="font-medium ml-3">Josh Chetar</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;