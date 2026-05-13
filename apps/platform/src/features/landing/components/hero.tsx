'use client'

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { WorkerMarquee } from "./worker-marquee";
import { useCategories, useAuthSession } from "@/hooks/api-hooks";
import { useState } from "react";
import { useBookingStore } from "@/store/booking-store";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const { data: session } = useAuthSession();
  const { data: categories, isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { setCategoryId, setServiceType } = useBookingStore();
  const router = useRouter();

  const handleFindPro = () => {
    // 1. Check if user is logged in
    if (!session) {
      const callbackUrl = selectedCategory 
        ? `/book-service?categoryId=${selectedCategory}` 
        : `/book-service`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // 2. Handle selected category
    if (selectedCategory) {
      setCategoryId(selectedCategory);
      
      const category = categories?.find((cat: any) => cat.id === selectedCategory);
      if (category) {
        setServiceType(category.name);
      }
      
      router.push(`/book-service?categoryId=${selectedCategory}`);
    } else {
      router.push("/book-service");
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-white via-[#ECFDF5] to-[#F8FAFC] pt-[148px] pb-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-16">
        <div className="relative mx-auto max-w-[680px] text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[36px] leading-[44px] sm:text-[46px] sm:leading-[54px] lg:text-[52px] lg:leading-[60px] font-extrabold tracking-[-2px] text-[#1E293B]"
          >
            Quality home repairs,
            <span className="text-[#6366F1]"> guaranteed.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-3 max-w-[580px] text-[16px] leading-6 text-[#404040]"
          >
            Connect with trusted plumbers, electricians, and heating engineers throughout
            Nigeria in under 120 seconds.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 flex flex-col sm:flex-row w-full max-w-[540px] gap-3"
          >
            <div className="relative block flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#525252] bg-white/90 px-4 pr-11 text-sm text-[#3F3F46] outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">What do you need help with?</option>
                {!isLoading && Array.isArray(categories) && categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525B]" />
            </div>
            <button 
              onClick={handleFindPro}
              className="h-11 w-full sm:w-auto sm:min-w-40 rounded-xl bg-[#1D4ED8] px-6 text-sm font-medium text-white transition-all hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98]"
            >
              Find a pro
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <WorkerMarquee />
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="pointer-events-none absolute right-[-120px] top-[220px] h-72 w-72 rotate-[-12deg] rounded-[210px] bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(16,185,129,0.12)_0%,rgba(0,0,0,0)_70%)]" 
      />
    </section>
  );
};
