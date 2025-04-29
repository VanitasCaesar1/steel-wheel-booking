
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 bg-black text-white">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Expert Car Service <span className="text-steel-300">You Can Trust</span></h2>
            <p className="text-steel-100 mb-4 text-lg">
              Steel Wheel has been providing premium automotive care for over 15 years. 
              Our team of certified mechanics is dedicated to keeping your vehicle running at its best.
            </p>
            <p className="text-steel-100 mb-4 text-lg">
              We believe in complete transparency and honest service. That's why we provide detailed 
              explanations of all work performed and only recommend services your vehicle actually needs.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <div className="h-2 w-2 bg-steel-300 rounded-full mr-3"></div>
                <span>Certified master mechanics</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-steel-300 rounded-full mr-3"></div>
                <span>State-of-the-art diagnostic equipment</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-steel-300 rounded-full mr-3"></div>
                <span>Genuine or OEM-quality parts</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-steel-300 rounded-full mr-3"></div>
                <span>12-month/12,000-mile warranty on all services</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">What Our Customers Say</h3>
            <div className="space-y-4">
              <Card className="bg-steel-800 border-steel-700">
                <CardContent className="pt-6">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8A898C" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-steel-100 mb-4">
                    "The team at Steel Wheel is exceptional. They fixed my car quickly and at a reasonable price. 
                    I appreciate their honesty and clear explanations of the work needed."
                  </p>
                  <p className="font-medium">Sarah T.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-steel-800 border-steel-700">
                <CardContent className="pt-6">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8A898C" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-steel-100 mb-4">
                    "I've been taking my vehicles to Steel Wheel for years. Their online booking system makes scheduling 
                    easy, and their service is always top-notch. Highly recommend!"
                  </p>
                  <p className="font-medium">Michael D.</p>
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
