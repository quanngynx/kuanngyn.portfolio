'use client'

import { useState, useEffect } from 'react'
import { useScroll, motion } from 'framer-motion'

export function ReadingProgressBar() {
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setTargetEl(document.getElementById('blog-article'))
  }, [])

  const { scrollYProgress } = useScroll({
    target: targetEl ? { current: targetEl } : undefined,
    offset: ['start start', 'end end']
  })

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary"
    />
  )
}
