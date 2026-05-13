'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full aspect-square max-w-[300px] mx-auto"
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-12 border border-zinc-200">
             <div className="text-9xl font-bold text-blue-700 opacity-20 select-none">404</div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-700/20 rotate-12">
                   <HiOutlineHome className="w-12 h-12 text-white" />
                </div>
             </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-slate-900 text-4xl md:text-5xl font-bold tracking-tight">
            Admin <span className="text-blue-700">Lost?</span>
          </h1>
          <p className="text-zinc-600 text-lg md:text-xl font-normal max-w-lg mx-auto leading-relaxed">
            This administrative route doesn't exist. Let's get you back to the control panel.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Link href="/dashboard">
            <button className="h-12 px-8 rounded-xl bg-blue-700 text-white font-medium flex items-center gap-2 hover:bg-blue-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-700/10">
              <HiOutlineHome className="w-5 h-5" />
              Back to Dashboard
            </button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="h-12 px-8 rounded-xl border border-zinc-300 bg-white text-zinc-700 font-medium flex items-center gap-2 hover:bg-zinc-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Brand Watermark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 select-none">
        <h2 className="text-xl font-bold text-slate-400">ResolvHome Admin</h2>
      </div>
    </div>
  )
}
