'use client'

import { motion } from 'framer-motion'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-[#F5F0E8]/40 font-body">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-[#F5F0E8]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#2952A3] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
