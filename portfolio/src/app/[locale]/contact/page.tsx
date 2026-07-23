"use client"

import type React from "react"

import { useState, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "@/common/utils/motion"
import Link from "next/link"
import { ArrowLeft, Send, Mail, Phone, MapPin } from 'lucide-react'
import { Github, Linkedin } from '@/common/components/atoms/icons'
import { Button } from "@/common/components/atoms/button"
import { Input } from "@/common/components/atoms/input"
import { Textarea } from "@/common/components/atoms/textarea"
import { Tooltip } from "@/common/components/atoms/tooltip/tooltip"
import { useParams } from "next/navigation"

gsap.registerPlugin(useGSAP)

export default function ContactPage() {
  const container = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? ""
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Entrance Animation
    gsap.from(".contact-header > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

    gsap.from(".contact-form", {
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.2
    });

    gsap.from(".contact-info-block", {
      x: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.3
    });

    gsap.from(".contact-item-link", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "back.out(1.5)",
      delay: 0.6
    });

  }, { scope: container });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (prefersReducedMotion) return;
    gsap.to(e.target, { scale: 1.01, duration: 0.3, ease: "power2.out" });
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (prefersReducedMotion) return;
    gsap.to(e.target, { scale: 1, duration: 0.3, ease: "power2.out" });
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Button submit animation
    if (!prefersReducedMotion) {
      gsap.to(".submit-btn", { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    if (!prefersReducedMotion) {
      gsap.fromTo(".success-message", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const contactInfo = [
    { icon: Mail, label: "Email", value: "nguyenminhquan042004@gmail.com", href: "mailto:nguyenminhquan042004@gmail.com" },
    { icon: Phone, label: "Phone", value: "+84 37 444 4252", href: "tel:+84374444252" },
  ]

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com", color: "hover:text-gray-300" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:text-[#00d2ff]" },
  ]

  return (
    <div ref={container} className="min-h-screen bg-[#15161a] text-white">
      {/* Sidebar */}
      <div className="fixed left-4 top-8 z-50 flex flex-col items-center space-y-4 bg-[#2a2d36] rounded-full p-4 h-fit">
        <Tooltip content="Home">
          <Link
            href={`/${locale}`}
            className="rounded-full bg-white/10 hover:bg-[#00d2ff]/20 transition-all duration-300 transform hover:scale-110 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 group-hover:text-[#00d2ff]" />
          </Link>
        </Tooltip>
      </div>

      {/* Main Content */}
      <div className="ml-24 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="contact-header mb-4">
            <h1 className="text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-white via-[#00d2ff] to-[#3a7bd5] bg-clip-text text-transparent">Let's work together</h1>
            <p className="text-xl text-[#aaaeb9] max-w-2xl text-pretty">
              Have a project in mind or just want to chat? I'd love to hear from you. Drop me a message and let's create
              something amazing together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            {/* Contact Form */}
            <div className="contact-form space-y-6">
              <div className="bg-[#2a2d36] rounded-2xl p-6 border border-[#3f424d] hover:border-[#00d2ff]/30 transition-colors duration-500">
                <h2 className="text-2xl font-semibold mb-4">Send a message</h2>

                {isSubmitted ? (
                  <div className="success-message text-center py-12">
                    <div className="w-16 h-16 bg-[#00d2ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-[#00d2ff]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                    <p className="text-[#aaaeb9]">Thanks for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#aaaeb9]">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className="bg-[#15161a] border-[#3f424d] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-white transition-all duration-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#aaaeb9]">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          className="bg-[#15161a] border-[#3f424d] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-white transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[#aaaeb9]">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="bg-[#15161a] border-[#3f424d] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-white transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#aaaeb9]">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="bg-[#15161a] border-[#3f424d] focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] text-white resize-none transition-all duration-300"
                        placeholder="Tell me about your project or idea..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-btn w-full bg-gradient-to-r from-[#000588] to-[#00d2ff] hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 group">
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info & Social */}
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="contact-info-block bg-[#2a2d36] rounded-2xl p-6 border border-[#3f424d] hover:border-[#3a7bd5]/30 transition-colors duration-500">
                <h2 className="text-2xl font-semibold mb-2">Get in touch</h2>
                <div className="">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="contact-item flex items-center space-x-4 p-3 rounded-xl hover:bg-[#3f424d] transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-[#15161a] rounded-lg flex items-center justify-center group-hover:bg-[#00d2ff]/10 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-[#aaaeb9] group-hover:text-[#00d2ff] transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="text-sm text-[#717689] group-hover:text-[#aaaeb9] transition-colors">{item.label}</p>
                        <p className="font-medium text-[#cdffe8] group-hover:text-white transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-info-block bg-[#2a2d36] rounded-2xl p-6 border border-[#3f424d] hover:border-[#3a7bd5]/30 transition-colors duration-500">
                <h2 className="text-2xl font-semibold mb-4">Follow me</h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      onClick={() => window.open(social.href, '_blank')}
                      className={`contact-item-link flex items-center justify-center space-x-2 p-3 rounded-xl bg-[#15161a] hover:bg-[#3f424d] border border-transparent hover:border-[#3f424d] transition-all duration-300 group ${social.color}`}
                    >
                      <social.icon className="w-5 h-5 text-[#aaaeb9] group-hover:text-current transition-colors" />
                      <span className="font-medium text-[#aaaeb9] group-hover:text-white transition-colors">{social.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {/* Availability Status */}
          <div
            className="contact-info-block bg-gradient-to-r from-[#000588]/20 to-[#00d2ff]/20 rounded-2xl p-6 border border-[#00d2ff]/30 relative overflow-hidden group hover:border-[#00d2ff]/60 transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <h3 className="text-lg font-semibold text-white">Available for work</h3>
              </div>
              <p className="text-[#cdffe8] text-pretty text-sm leading-relaxed">
                I'm currently accepting new projects and collaborations. Let's discuss how we can bring your AI ideas to
                life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

