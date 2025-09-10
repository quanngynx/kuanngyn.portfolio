"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip } from "@/components/tooltip"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@alexjohnson.dev", href: "mailto:hello@alexjohnson.dev" },
    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, label: "Location", value: "San Francisco, CA", href: "#" },
  ]

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com", color: "hover:text-gray-300" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "hover:text-blue-400" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com", color: "hover:text-blue-300" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com", color: "hover:text-pink-400" },
  ]

  return (
    <div className="min-h-screen bg-[#15161a] text-white">
      {/* Sidebar */}
      <div className="fixed left-4 top-8 z-50 flex flex-col items-center space-y-4 bg-[#2a2d36] rounded-full p-4 sticky h-fit">
        <Tooltip content="Home">
          <Link
            href="/"
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Tooltip>
      </div>

      {/* Main Content */}
      <div className="ml-24 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-balance">Let's work together</h1>
            <p className="text-xl text-[#aaaeb9] max-w-2xl text-pretty">
              Have a project in mind or just want to chat? I'd love to hear from you. Drop me a message and let's create
              something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[#2a2d36] rounded-2xl p-8 border border-[#3f424d]">
                <h2 className="text-2xl font-semibold mb-6">Send a message</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                    <p className="text-[#aaaeb9]">Thanks for reaching out. I'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-[#15161a] border-[#3f424d] focus:border-[#b6d2ff] text-white"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-[#15161a] border-[#3f424d] focus:border-[#b6d2ff] text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-[#15161a] border-[#3f424d] focus:border-[#b6d2ff] text-white"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-[#15161a] border-[#3f424d] focus:border-[#b6d2ff] text-white resize-none"
                        placeholder="Tell me about your project or idea..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#000588] to-[#b6d2ff] hover:from-[#000588]/80 hover:to-[#b6d2ff]/80 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Contact Information */}
              <div className="bg-[#2a2d36] rounded-2xl p-8 border border-[#3f424d]">
                <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#3f424d] transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-[#15161a] rounded-lg flex items-center justify-center group-hover:bg-[#000588] transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-[#aaaeb9] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <p className="text-sm text-[#717689]">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-[#2a2d36] rounded-2xl p-8 border border-[#3f424d]">
                <h2 className="text-2xl font-semibold mb-6">Follow me</h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className={`flex items-center justify-center space-x-2 p-4 rounded-xl bg-[#15161a] hover:bg-[#3f424d] transition-all duration-300 transform hover:scale-105 active:scale-95 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-medium">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-[#000588]/20 to-[#b6d2ff]/20 rounded-2xl p-8 border border-[#b6d2ff]/30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <h3 className="text-lg font-semibold">Available for work</h3>
                </div>
                <p className="text-[#aaaeb9] text-pretty">
                  I'm currently accepting new projects and collaborations. Let's discuss how we can bring your ideas to
                  life.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
