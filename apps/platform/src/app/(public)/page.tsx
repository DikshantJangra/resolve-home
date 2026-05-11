import { Hero } from "@/features/landing/components/hero";
import { ServiceGrid } from "@/features/landing/components/service-grid";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { AboutNetwork } from "@/features/landing/components/about-network";
import { Membership } from "@/features/landing/components/membership";
import { ContactFAQ } from "@/features/landing/components/contact-faq";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Hero />
      <ServiceGrid />
      <HowItWorks />
      <AboutNetwork />
      <Membership />
      <ContactFAQ />
    </div>
  );
}
