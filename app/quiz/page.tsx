'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '@/lib/questions'
import ProgressBar from '@/components/ProgressBar'
import BrandSelector from '@/components/BrandSelector'

type Answers = Record<string, string | number | string[] | Record<string, string>>

const HEIGHTS: string[] = []
for (let ft = 4; ft <= 6; ft++) {
  const maxIn = ft === 4 ? 10 : ft === 5 ? 11 : 2
  const minIn = ft === 4 ? 10 : 0
  for (let inch = minIn; inch <= maxIn; inch++) {
    HEIGHTS.push(`${ft}'${inch}"`)
  }
}

const WAISTS: string[] = []
for (let i = 24; i <= 52; i++) WAISTS.push(`${i}"`)

const HIPS: string[] = []
for (let i = 32; i <= 60; i++) HIPS.push(`${i}"`)

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [direction, setDirection] = useState(1)

  const q = questions[step]
  const totalSteps = questions.length

  const go = (dir: number) => {
    setDirection(dir)
    setStep(s => s + dir)
  }

  const set = (key: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [key]: value as string | number | string[] | Record<string, string> }))
  }

  const canProceed = () => {
    if (q.optional) return true
    const val = answers[q.key]
    if (q.type === 'multi-select') return Array.isArray(val) && (val as string[]).length > 0
    if (q.type === 'brand-sizes') {
      const brands = answers['brands'] as string[] || []
      const sizes = answers['brandSizes'] as Record<string, string> || {}
      return brands.every(b => sizes[b])
    }
    return !!val
  }

  const handleNext = () => {
    if (step === totalSteps - 1) {
      const params = new URLSearchParams()
      for (const [k, v] of Object.entries(answers)) {
        params.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
      }
      router.push(`/complete?${params.toString()}`)
    } else {
      go(1)
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <main className="min-h-dvh flex flex-col max-w-md mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => go(-1)}
              className="text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors p-1 -ml-1"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors p-1 -ml-1"
            >
              ← Home
            </button>
          )}
          <span className="text-xs text-[#F5F0E8]/30 tracking-widest uppercase font-body">Jackie Jeans</span>
          <div className="w-12" />
        </div>
        <ProgressBar current={step + 1} total={totalSteps} />
      </div>

      {/* Question */}
      <div className="flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="font-display text-2xl text-[#F5F0E8] leading-snug">
                {q.text}
              </h2>
              {q.hint && (
                <p className="text-sm text-[#F5F0E8]/40 font-body">{q.hint}</p>
              )}
            </div>

            {/* Inputs */}
            {q.type === 'dropdown' && (
              <select
                value={(answers[q.key] as string) || ''}
                onChange={e => set(q.key, e.target.value)}
                className="w-full bg-[#F5F0E8]/10 text-[#F5F0E8] rounded-2xl px-4 py-4 text-base font-body border border-[#F5F0E8]/10 focus:border-[#2952A3] outline-none appearance-none"
              >
                <option value="" style={{ backgroundColor: '#1a1a1a', color: '#F5F0E8' }}>Select…</option>
                {q.options?.map(o => <option key={o} value={o} style={{ backgroundColor: '#1a1a1a', color: '#F5F0E8' }}>{o}</option>)}
              </select>
            )}

            {q.type === 'number' && (
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="e.g. 145"
                  value={(answers[q.key] as number) || ''}
                  onChange={e => set(q.key, e.target.value)}
                  className="w-full bg-[#F5F0E8]/10 text-[#F5F0E8] rounded-2xl px-4 py-4 text-base font-body border border-[#F5F0E8]/10 focus:border-[#2952A3] outline-none"
                />
                {q.optional && (
                  <button
                    onClick={() => { set(q.key, 'skipped'); handleNext() }}
                    className="text-sm text-[#F5F0E8]/40 hover:text-[#F5F0E8]/60 transition-colors underline underline-offset-2"
                  >
                    Skip this question
                  </button>
                )}
              </div>
            )}

            {q.type === 'single-select' && (
              <div className="space-y-2">
                {q.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => set(q.key, opt)}
                    className={`w-full text-left px-4 py-4 rounded-2xl font-body text-base transition-all active:scale-[0.98] ${
                      answers[q.key] === opt
                        ? 'bg-[#2952A3] text-white'
                        : 'bg-[#F5F0E8]/10 text-[#F5F0E8]/80 hover:bg-[#F5F0E8]/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'multi-select' && (
              <BrandSelector
                selectedBrands={(answers['brands'] as string[]) || []}
                brandSizes={(answers['brandSizes'] as Record<string, string>) || {}}
                onBrandsChange={brands => set('brands', brands)}
                onSizeChange={(brand, size) => {
                  const prev = (answers['brandSizes'] as Record<string, string>) || {}
                  set('brandSizes', { ...prev, [brand]: size })
                }}
              />
            )}

            {q.type === 'brand-sizes' && (
              <BrandSelector
                selectedBrands={(answers['brands'] as string[]) || []}
                brandSizes={(answers['brandSizes'] as Record<string, string>) || {}}
                onBrandsChange={brands => set('brands', brands)}
                onSizeChange={(brand, size) => {
                  const prev = (answers['brandSizes'] as Record<string, string>) || {}
                  set('brandSizes', { ...prev, [brand]: size })
                }}
                showSizes
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6"
      >
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full bg-[#F5F0E8] text-[#0C0A09] rounded-2xl py-4 px-6 font-body font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {step === totalSteps - 1 ? 'See my fit →' : 'Continue →'}
        </button>
      </motion.div>
    </main>
  )
}
