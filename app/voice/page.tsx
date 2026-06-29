'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '@/lib/questions'
import { parseHeight, parseNumber, parseMeasurement, parseSingleSelect, parseBrands, parseDenimSize } from '@/lib/parseVoiceAnswer'
import VoiceOrb from '@/components/VoiceOrb'
import ProgressBar from '@/components/ProgressBar'

type OrbState = 'idle' | 'listening' | 'speaking' | 'thinking'
type Answers = Record<string, unknown>

interface SpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous?: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoicePage() {
  const router = useRouter()
  const [step, setStep] = useState(-1)
  const [orbState, setOrbState] = useState<OrbState>('idle')
  const [transcript, setTranscript] = useState('')
  const [caption, setCaption] = useState('')
  const [answers, setAnswers] = useState<Answers>({})
  const [brandSizeIndex, setBrandSizeIndex] = useState(0)
  const brandSizeIndexRef = useRef(0)
  const [error, setError] = useState('')
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const pendingBrandSizes = useRef<Record<string, string>>({})

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      synthRef.current?.cancel()
      recognitionRef.current?.abort()
    }
  }, [])

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise(resolve => {
      if (!synthRef.current) { resolve(); return }
      synthRef.current.cancel()
      setOrbState('speaking')
      setCaption(text)
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate = 1.05
      utt.pitch = 1
      const voices = synthRef.current.getVoices()
      const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google UK English Female'))
      if (preferred) utt.voice = preferred
      utt.onend = () => { setOrbState('idle'); resolve() }
      utt.onerror = () => { setOrbState('idle'); resolve() }
      synthRef.current.speak(utt)
    })
  }, [])

  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) { reject(new Error('no-support')); return }
      const recognition = new SR()
      recognitionRef.current = recognition
      recognition.lang = 'en-US'
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      setOrbState('listening')
      setTranscript('')

      let finalResult = ''

      recognition.onresult = (e) => {
        const t = Array.from(e.results).map(r => r[0].transcript).join('')
        finalResult = t
        setTranscript(t)
      }

      recognition.onend = () => {
        setOrbState('thinking')
        resolve(finalResult)
      }

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') reject(e.error)
        else resolve('')
      }

      recognition.start()
    })
  }, [])

  const handleAnswer = useCallback(async (speech: string, stepIndex: number): Promise<boolean> => {
    const q = questions[stepIndex]
    let parsed: unknown = null

    if (q.key === 'height') parsed = parseHeight(speech)
    else if (q.key === 'weight') {
      const n = parseNumber(speech)
      if (n === -1) parsed = 'skipped'
      else if (n) parsed = n
    }
    else if (q.key === 'waist' || q.key === 'hips') parsed = parseMeasurement(speech)
    else if (q.type === 'single-select' && q.options) parsed = parseSingleSelect(speech, q.options)
    else if (q.key === 'brands') {
      const brands = parseBrands(speech)
      if (brands.length > 0) parsed = brands
    }
    else if (q.key === 'brandSizes') {
      const size = parseDenimSize(speech)
      if (size) parsed = size
    }
    else if (q.key === 'frustration' && q.options) parsed = parseSingleSelect(speech, q.options)

    if (parsed === null || parsed === undefined || parsed === '') {
      await speak("Sorry, I didn't catch that. Could you repeat?")
      return false
    }

    let confirm = ''
    if (q.key === 'height') confirm = `Got it — ${parsed}.`
    else if (q.key === 'weight') confirm = parsed === 'skipped' ? "No problem, skipping that." : `Got it — ${parsed} pounds.`
    else if (q.key === 'waist') confirm = `Waist at ${parsed}.`
    else if (q.key === 'hips') confirm = `Hips at ${parsed}.`
    else if (q.key === 'brands') confirm = `Great, I have ${(parsed as string[]).join(', ')}.`
    else if (q.key === 'brandSizes') confirm = `${parsed}.`
    else confirm = `${parsed}.`

    await speak(confirm)

    if (q.key === 'brandSizes') {
      const idx = brandSizeIndexRef.current
      const brands = (answers['brands'] as string[]) || []
      pendingBrandSizes.current[brands[idx]] = parsed as string
      const next = idx + 1
      if (next < brands.length) {
        brandSizeIndexRef.current = next
        setBrandSizeIndex(next)
        return false
      } else {
        setAnswers(prev => ({ ...prev, brandSizes: { ...pendingBrandSizes.current } }))
        return true
      }
    }

    setAnswers(prev => ({ ...prev, [q.key]: parsed }))
    return true
  }, [speak, answers])

  const runVoiceStep = useCallback(async (stepIndex: number) => {
    if (stepIndex >= questions.length) return

    const q = questions[stepIndex]
    let questionText = q.voiceText

    if (q.key === 'brandSizes') {
      const brands = (answers['brands'] as string[]) || []
      if (brands.length === 0) { setStep(s => s + 1); return }
      questionText = `What size did you usually buy in ${brands[brandSizeIndexRef.current]}?`
    }

    await speak(questionText)

    let success = false
    let attempts = 0
    while (!success && attempts < 3) {
      attempts++
      try {
        const speech = await listen()
        if (!speech.trim()) {
          if (q.optional) {
            setAnswers(prev => ({ ...prev, [q.key]: 'skipped' }))
            await speak("Okay, skipping that.")
            success = true
          } else {
            await speak("I didn't hear anything. Let's try again.")
          }
          continue
        }
        success = await handleAnswer(speech, stepIndex)
      } catch {
        setError("Voice not supported on this browser. Please use Chrome.")
        return
      }
    }

    if (!success && attempts >= 3) {
      await speak("No problem, let's move on.")
      if (q.optional) setAnswers(prev => ({ ...prev, [q.key]: 'skipped' }))
    }

    if (q.key === 'brandSizes') {
      const brands = (answers['brands'] as string[]) || []
      if (brandSizeIndexRef.current < brands.length - 1) return
    }

    if (stepIndex === questions.length - 1) {
      await speak("Perfect — I have everything I need. Let me take you to your fit results!")
      const params = new URLSearchParams()
      for (const [k, v] of Object.entries(answers)) {
        params.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
      }
      router.push(`/complete?${params.toString()}`)
    } else {
      setStep(s => s + 1)
    }
  }, [speak, listen, handleAnswer, answers, router])

  useEffect(() => {
    if (step >= 0 && step < questions.length) {
      runVoiceStep(step)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const startVoice = async () => {
    await speak("Hi! I'm your Jackie Jeans stylist. I'll ask you a few quick questions to find your perfect fit. Let's go!")
    setStep(0)
  }

  return (
    <main className="min-h-dvh flex flex-col items-center max-w-md mx-auto px-6 py-10">
      {/* Header */}
      <div className="w-full mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { synthRef.current?.cancel(); recognitionRef.current?.abort(); router.push('/') }}
            className="text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors"
          >
            ← Home
          </button>
          <span className="text-xs text-[#F5F0E8]/30 tracking-widest uppercase font-body">Jackie Jeans</span>
          <div className="w-12" />
        </div>
        {step >= 0 && <ProgressBar current={step + 1} total={questions.length} />}
      </div>

      {error && (
        <div className="w-full bg-red-900/30 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-300 text-sm font-body">
          {error} <a href="/quiz" className="underline">Use manual quiz instead →</a>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8">
        {step === -1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="font-display text-3xl text-[#F5F0E8]">Voice Fit Quiz</h1>
            <p className="text-[#F5F0E8]/50 font-body text-base max-w-xs">
              Talk to our AI stylist and we'll find your perfect fit — no typing required.
            </p>
            <p className="text-xs text-[#F5F0E8]/30 font-body">Best on Chrome · Allow microphone when prompted</p>
          </motion.div>
        )}

        {step >= 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={caption}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center px-4"
            >
              <p className="font-display text-xl text-[#F5F0E8] leading-relaxed">
                {caption}
              </p>
            </motion.div>
          </AnimatePresence>
        )}

        <VoiceOrb
          state={orbState}
          onClick={step === -1 ? startVoice : () => {
            if (orbState === 'listening') recognitionRef.current?.stop()
          }}
        />

        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-[#F5F0E8]/50 text-sm font-body italic">"{transcript}"</p>
          </motion.div>
        )}

        <p className="text-xs text-[#F5F0E8]/30 font-body tracking-wide">
          {step === -1 ? 'Tap the orb to start' : 
           orbState === 'listening' ? 'Listening…' :
           orbState === 'speaking' ? 'AI is speaking…' :
           orbState === 'thinking' ? 'Understanding…' : 'Tap orb or wait'}
        </p>

        <p className="text-xs text-[#F5F0E8]/20 font-body">
          Prefer typing? <a href="/quiz" className="underline hover:text-[#F5F0E8]/40">Use manual quiz</a>
        </p>
      </div>
    </main>
  )
}
