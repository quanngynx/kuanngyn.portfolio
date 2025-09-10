"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { YourName } from "@/common/utils/string"

interface SplashScreenProps {
  onComplete: () => void
  shouldShow: boolean
}

export function SplashScreen({ onComplete, shouldShow }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(shouldShow)
  const logoRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shouldShow) {
      onComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(onComplete, 500)
        }, 800)
      },
    })

    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)" },
    )
      .fromTo(textRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
      .to(logoRef.current, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }, "+=0.5")

    if (particlesRef.current) {
      const particles = particlesRef.current.children
      Array.from(particles).forEach((particle, index) => {
        gsap.fromTo(
          particle,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.6,
            duration: 0.5,
            delay: 0.5 + index * 0.1,
            ease: "power2.out",
          },
        )
        gsap.to(particle, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: "none",
          delay: 0.5 + index * 0.1,
        })
      })
    }

    return () => {
      tl.kill()
    }
  }, [onComplete, shouldShow])

  return (
    <AnimatePresence>
      {isVisible && shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-[#15161a] via-[#1a1b20] to-[#0f1014] flex items-center justify-center overflow-hidden"
        >
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-[#b6d2ff] to-[#cdffe8] rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="text-center relative z-10">
            <div ref={logoRef} className="mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#000588] via-purple-600 to-[#b6d2ff] rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-[#000588] to-purple-600 rounded-sm" />
                </motion.div>
              </motion.div>
            </div>

            <div ref={textRef}>
              <motion.h1
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#b6d2ff] to-[#cdffe8] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {YourName}
              </motion.h1>

              <motion.p
                className="text-[#aaaeb9] text-lg mb-8 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Creative Portfolio & Digital Experience
              </motion.p>

              <motion.div
                className="w-32 h-1 bg-[#2a2d36] rounded-full mx-auto overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#000588] to-[#b6d2ff] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
