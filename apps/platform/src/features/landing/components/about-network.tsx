'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@resolve/ui";

// Center of the Resolve Logo box (549+54, 330+54)
const CENTER = { x: 603, y: 384 };

const nodes = [
  { city: 'Enugu', initials: 'EN', border: '#FFC7AE', left: '46px', top: '44px', img: '/assets/workers/james.png', delay: 0, status: 'Soon' },
  { city: 'Osun', initials: 'OS', border: '#B0F9B7', left: '356px', top: '0px', img: '/assets/workers/ngozi.png', delay: 0.1, status: 'Soon' },
  { city: 'Lagos', initials: 'LG', border: '#9D7AFF', left: '775px', top: '7px', img: '/assets/workers/tunde.png', delay: 0.2, status: 'Active' },
  { city: 'Abuja', initials: 'AB', border: '#F3A3F9', left: '1064px', top: '155px', img: '/assets/workers/amaka.png', delay: 0.3, status: 'Soon' },
  { city: 'Ibadan', initials: 'IB', border: '#FFC7AE', left: '0px', top: '376px', img: '/assets/workers/kunle.png', delay: 0.4, status: 'Soon' },
  { city: 'Imo', initials: 'IM', border: '#BCA7FF', left: '224px', top: '578px', img: '/assets/workers/james.png', delay: 0.5, status: 'Soon' },
  { city: 'Ogun', initials: 'OG', border: '#CDE6FF', left: '873px', top: '598px', img: '/assets/workers/tunde.png', delay: 0.6, status: 'Soon' },
  { city: 'Ekiti', initials: 'EK', border: '#FFE763', left: '1103px', top: '381px', img: '/assets/workers/ngozi.png', delay: 0.7, status: 'Soon' },
];

// Calculated paths to reach EXACT centers of nodes from EXACT center of Resolve logo
const refinedPaths = [
  `M${CENTER.x} ${CENTER.y} C 470 360, 320 320, 104.5 102.5`, // Enugu
  `M${CENTER.x} ${CENTER.y} C 560 330, 470 270, 414.5 58.5`,  // Osun
  `M${CENTER.x} ${CENTER.y} C 700 330, 760 250, 833.5 65.5`,  // Lagos
  `M${CENTER.x} ${CENTER.y} C 770 340, 900 310, 1122.5 213.5`, // Abuja
  `M${CENTER.x} ${CENTER.y} C 470 430, 280 430, 58.5 434.5`,  // Ibadan
  `M${CENTER.x} ${CENTER.y} C 520 430, 400 520, 282.5 636.5`, // Imo
  `M${CENTER.x} ${CENTER.y} C 720 430, 760 520, 931.5 656.5`, // Ogun
  `M${CENTER.x} ${CENTER.y} C 840 385, 980 420, 1161.5 439.5`, // Ekiti
];

import { FigmaImage } from "@resolve/ui"
export const AboutNetwork = () => {
  const animatedNodes = React.useMemo(() => {
    return nodes.map(node => ({
      ...node,
      yDuration: 2 + Math.random(),
      xDuration: 2.5 + Math.random()
    }));
  }, []);

  return (
    <section className="bg-[#0B245B] py-24 text-white lg:py-32 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 relative z-10">
        <div className="mx-auto max-w-[720px] text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-blue-200 text-xl font-bold uppercase tracking-widest"
          >
            Our Network
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-4xl md:text-5xl font-bold text-white"
          >
            Technicians everywhere you need them.
          </motion.h2>
        </div>

        {/* Desktop Map - High Speed Octopus Animation */}
        <div className="relative hidden lg:block w-[1218px] h-[753px] mx-auto">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 1218 753" fill="none">
            {refinedPaths.map((path, idx) => (
              <motion.path
                key={idx}
                d={path}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeDasharray="8 12"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                animate={{ 
                  strokeDashoffset: [0, -100],
                  strokeWidth: [2, 4, 2]
                }}
                transition={{ 
                  pathLength: { duration: 0.8, delay: idx * 0.05 },
                  opacity: { duration: 0.5, delay: idx * 0.05 },
                  strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" }, // Fast flow
                  strokeWidth: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 } // Fast breathing
                }}
              />
            ))}
          </svg>

          {/* Center Hub */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 40px rgba(255,255,255,0.2)",
                "0 0 80px rgba(59,130,246,0.5)",
                "0 0 40px rgba(255,255,255,0.2)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[549px] top-[330px] w-[108px] h-[108px] bg-white rounded-full flex items-center justify-center z-20"
          >
            <Image src="/logo.svg" alt="ResolvHome" width={80} height={80} className="h-auto w-3/4" />
          </motion.div>

          {/* Floating Nodes */}
          {animatedNodes.map((node) => (
            <motion.div
              key={node.city}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ 
                y: [0, -15, 0],
                x: [0, 8, 0]
              }}
              transition={{ 
                opacity: { duration: 0.3, delay: node.delay },
                scale: { duration: 0.3, delay: node.delay },
                y: { duration: node.yDuration, repeat: Infinity, ease: "easeInOut" },
                x: { duration: node.xDuration, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute group flex flex-col items-center gap-2 z-30"
              style={{ left: node.left, top: node.top }}
            >
              <div className="text-[20px] font-semibold text-[#fcfcfc] text-center whitespace-nowrap drop-shadow-xl group-hover:text-blue-300 transition-colors flex flex-col items-center gap-1">
                <span>{node.city}</span>
                {node.status === 'Active' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">Soon</span>
                )}
              </div>
              <div 
                className="relative group-hover:scale-110 transition-transform duration-200 cursor-pointer rounded-full border-[4px] shadow-2xl overflow-hidden bg-[#1E293B]"
                style={{ borderColor: node.border }}
              >
                <FigmaImage 
                  src={node.img}
                  alt={node.city}
                  fallbackInitial={node.initials}
                  className="w-[117px] h-[117px]"
                  sizes="117px"
                />
                {node.status === 'Active' && (
                  <span className="absolute right-[12px] top-[6px] h-4 w-4 rounded-full border-2 border-white bg-[#2AC38B] z-20">
                     <span className="absolute inset-0 rounded-full bg-[#2AC38B] animate-ping opacity-100" />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet Grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
          {nodes.map((node, idx) => (
            <motion.div 
              key={node.city} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 rounded-2xl bg-white/10 border border-white/20 p-4"
            >
              <FigmaImage 
                src={node.img} 
                alt={node.city}
                fallbackInitial={node.initials} 
                className="w-16 h-16 rounded-full border-2" 
                sizes="64px"
                style={{ borderColor: node.border }}
              />
              <div className="flex flex-col gap-1 items-start">
                <div className="text-lg font-semibold text-white leading-none">{node.city}</div>
                {node.status === 'Active' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">Soon</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
