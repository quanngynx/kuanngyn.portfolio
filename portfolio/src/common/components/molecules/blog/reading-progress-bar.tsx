'use client'

import { useScroll, motion } from 'framer-motion'
import type { RefObject } from 'react'

interface Props {
  targetRef: RefObject<HTMLElement | null>
}

export function ReadingProgressBar({ targetRef }: Props) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary"
    />
  )
}
