'use client'

import { motion } from 'framer-motion'

type State = 'idle' | 'listening' | 'speaking' | 'thinking'

interface Props {
  state: State
  onClick: () => void
}

export default function VoiceOrb({ state, onClick }: Props) {
  const colors: Record<State, string> = {
    idle: '#1B3A6B',
    listening: '#2952A3',
    speaking: '#4F46E5',
    thinking: '#1B3A6B',
  }

  return (
    <button
      onClick={onClick}
      className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto focus:outline-none"
      aria-label={state === 'listening' ? 'Stop listening' : 'Start listening'}
    >
      {state === 'listening' && (
        <>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-[#2952A3]/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1 + i * 0.35, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        animate={{ backgroundColor: colors[state], scale: state === 'listening' ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-4xl">
          {state === 'listening' ? '🎙️' : state === 'speaking' ? '🔊' : state === 'thinking' ? '💭' : '🎙️'}
        </span>
      </motion.div>
    </button>
  )
}
