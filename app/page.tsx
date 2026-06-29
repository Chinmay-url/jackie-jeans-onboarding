'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-dvh flex flex-col items-center justify-between px-6 py-12 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-[#F5F0E8]/40 font-body">
          Jackie Jeans
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center space-y-6"
      >
        <h1 className="font-display text-5xl leading-[1.1] text-[#F5F0E8]">
          Jeans that<br />
          <span className="text-[#2952A3] italic">actually</span> fit.
        </h1>
        <p className="text-[#F5F0E8]/60 text-base leading-relaxed font-body max-w-xs mx-auto">
          Answer 10 quick questions and we'll match you with denim made for your body — not a size chart.
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full space-y-3"
      >
        <button
          onClick={() => router.push('/quiz')}
          className="w-full bg-[#F5F0E8] text-[#0C0A09] rounded-2xl py-4 px-6 font-body font-semibold text-base tracking-wide hover:bg-white transition-colors active:scale-[0.98]"
        >
          Take the Fit Quiz
        </button>
        <button
          onClick={() => router.push('/voice')}
          className="w-full bg-[#1B3A6B] text-[#F5F0E8] rounded-2xl py-4 px-6 font-body font-semibold text-base tracking-wide hover:bg-[#2952A3] transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="text-lg">🎙️</span>
          Try Voice Onboarding
        </button>

        <p className="text-center text-[#F5F0E8]/30 text-xs pt-2 font-body">
          ~2 minutes · No account needed
        </p>
      </motion.div>
    </main>
  )
}
