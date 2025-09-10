"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: "right" | "left"
  delay?: number
}

const TooltipComponent = ({ content, children, position = "right", delay = 500 }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positionClasses = {
    right: "left-full ml-3",
    left: "right-full mr-3",
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: position === "right" ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: position === "right" ? -10 : 10 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`absolute top-1/2 -translate-y-1/2 ${positionClasses[position]} z-50 pointer-events-none`}
          >
            <div className="bg-[#2a2d36] border border-[#3f424d] rounded-lg px-3 py-2 shadow-xl backdrop-blur-sm">
              <p className="text-white text-sm font-medium whitespace-nowrap">{content}</p>
              {/* Arrow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#2a2d36] border-[#3f424d] rotate-45 ${
                  position === "right" ? "-left-1 border-l border-b" : "-right-1 border-r border-t"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { TooltipComponent as Tooltip }
export default TooltipComponent
