'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense, useEffect } from 'react'

function CompleteInner() {
  const params = useSearchParams()

  useEffect(() => {
    const timer = setTimeout(() => {
      const profileParam = params.toString()
      window.location.href = `https://jackie-jeans.vercel.app/?fit=${encodeURIComponent(profileParam)}`
    }, 3000)
    return () => clearTimeout(timer)
  }, [params])

  const height = params.get('height') || '—'
  const waist = params.get('waist') || '—'
  const rise = params.get('rise') || '—'
  const thighFit = params.get('thighFit') || '—'
  const frustration = params.get('frustration') || '—'

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center max-w-md mx-auto px-6 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 w-full"
      >
        <div className="space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl"
          >
            ✓
          </motion.div>
          <h1 className="font-display text-3xl text-[#F5F0E8]">Your fit profile is ready.</h1>
          <p className="text-[#F5F0E8]/50 font-body text-sm">Taking you to your recommendations…</p>
        </div>

        {/* Summary card */}
        <div className="bg-[#F5F0E8]/5 border border-[#F5F0E8]/10 rounded-2xl p-5 text-left space-y-3">
          <p className="text-xs text-[#F5F0E8]/40 uppercase tracking-widest font-body">Your profile</p>
          {[
            ['Height', height],
            ['Waist', waist],
            ['Rise', rise],
            ['Thigh fit', thighFit],
            ['Main frustration', frustration],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-[#F5F0E8]/50 font-body">{label}</span>
              <span className="text-sm text-[#F5F0E8] font-body font-medium">{val}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <a
            href="https://jackie-jeans.vercel.app/"
            className="inline-block w-full bg-[#F5F0E8] text-[#0C0A09] rounded-2xl py-4 px-6 font-body font-semibold text-base"
          >
            Go to Jackie Jeans →
          </a>
        </motion.div>
      </motion.div>
    </main>
  )
}

export default function CompletePage() {
  return (
    <Suspense>
      <CompleteInner />
    </Suspense>
  )
}
