import Image from 'next/image';
import Link from 'next/link';
import { 
  IoCallOutline, 
  IoMailOutline, 
  IoLogoTwitter, 
  IoLogoLinkedin, 
  IoLogoInstagram 
} from 'react-icons/io5';

const services = ['Plumbing', 'Electrical', 'Emergency Call-Out'];
const signupLinks = ['Technician', 'Home', 'Emergency Call-Out'];

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F5F5] pb-12 pt-10">
      <div className="mx-auto max-w-[1440px] w-full px-6 lg:px-12 bg-[#000D2B] rounded-[16px] overflow-hidden flex flex-col items-center">
        {/* Main Content Area */}
        <div className="w-full pt-16 pb-20 px-8 lg:px-12 flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-0">
          
          {/* Left Section: Logo & Info */}
          <div className="flex-1 flex flex-col justify-start items-start gap-6">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <div className="relative h-9 w-[102px]">
                <Image
                  src="/resolve_home.svg"
                  alt="Resolve Home"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                  sizes="102px"
                />
              </div>
            </Link>
            
            <p className="w-full max-w-[340px] text-[#A4ACB8] text-[16px] leading-[1.6] font-medium">
              Fast, reliable home repairs booked in 60 seconds. Certified engineers, 
              transparent pricing, 24/7 emergency cover across Nigeria.
            </p>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-4 text-[#A4ACB8]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <IoCallOutline className="w-5 h-5" />
                </div>
                <span className="text-[15px] font-medium">+234 800 123 4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-4 text-[#A4ACB8]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <IoMailOutline className="w-5 h-5" />
                </div>
                <span className="text-[15px] font-medium">hello@resolvhome.ng</span>
              </div>
            </div>
          </div>

          {/* Right Section: Link Columns */}
          <div className="flex flex-wrap justify-start items-start gap-12 md:gap-24">
            {/* Services Column */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-[18px] font-bold uppercase tracking-wider">Services</h3>
              <div className="flex flex-col gap-4">
                {services.map((service) => (
                  <Link 
                    key={service} 
                    href="#services" 
                    className="text-[#A4ACB8] text-[16px] font-medium hover:text-white transition-colors"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sign Up Column */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-[18px] font-bold uppercase tracking-wider">Sign Up</h3>
              <div className="flex flex-col gap-4">
                {signupLinks.map((link) => (
                  <Link 
                    key={link} 
                    href={link === 'Home' ? '/' : '/register'} 
                    className="text-[#A4ACB8] text-[16px] font-medium hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Column */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-[18px] font-bold uppercase tracking-wider">Contact Us</h3>
              <div className="flex flex-col gap-5">
                <p className="text-[#A4ACB8] text-[15px] font-medium max-w-[200px]">hello@resolvhome.ng</p>
                <div className="flex items-center gap-3">
                  <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#A4ACB8] hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all">
                    <IoLogoTwitter className="w-5 h-5" />
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#A4ACB8] hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all">
                    <IoLogoLinkedin className="w-5 h-5" />
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#A4ACB8] hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all">
                    <IoLogoInstagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full px-8 lg:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#6D7583] text-[14px] font-medium text-center md:text-left">
            © 2026 Resolv Home Ltd. All rights reserved. Registered in Nigeria (RC: 1234567).
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[#6D7583] text-[13px] font-bold uppercase tracking-widest hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-[#6D7583] text-[13px] font-bold uppercase tracking-widest hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-[#6D7583] text-[13px] font-bold uppercase tracking-widest hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
