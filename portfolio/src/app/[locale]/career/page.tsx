"use client"

import { ArrowLeft, Calendar, Award, Briefcase, GraduationCap, Code, Palette, Camera, Globe, Activity } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/common/utils/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function CareerPage() {
  const container = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Hero Reveal
    gsap.from(".career-hero > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Stats Counters
    gsap.utils.toArray('.stat-counter').forEach((el: any) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        },
        innerHTML: target,
        duration: 1.5,
        snap: { innerHTML: 1 },
        ease: "power2.out"
      });
    });

    // Timeline Progress Line
    gsap.to(".timeline-progress", {
      scrollTrigger: {
        trigger: ".timeline-container",
        start: "top center",
        end: "bottom center",
        scrub: true
      },
      scaleY: 1,
      ease: "none"
    });

    // Milestone Reveal
    gsap.utils.toArray('.milestone-item').forEach((item: any, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power3.out"
      });
    });

    // Skills Reveal
    gsap.from(".skill-card", {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top bottom-=100",
      },
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    });

    // Skills Progress Bars
    gsap.utils.toArray('.skill-progress').forEach((bar: any) => {
      const width = bar.getAttribute('data-width');
      gsap.to(bar, {
        scrollTrigger: {
          trigger: bar,
          start: "top bottom-=50",
        },
        width: width,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
      });
    });

    // Achievements & Certs
    gsap.from(".achieve-card", {
      scrollTrigger: { trigger: ".achieve-grid", start: "top bottom-=100" },
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    gsap.from(".cert-card", {
      scrollTrigger: { trigger: ".cert-grid", start: "top bottom-=100" },
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });

  }, { scope: container });

  const stats = [
    { label: "Projects Delivered", value: 4 },
    { label: "Years Building", value: 2 },
    { label: "Technologies", value: 12 },
    { label: "Certifications", value: 1 },
  ]

  const milestones = [
    {
      year: "2026",
      title: "Software Engineer",
      company: "Servexa Warranty AI",
      description: "Developed an AI-powered warranty operation platform with RAG-based knowledge retrieval and Copilot assistance.",
      type: "work",
    },
    {
      year: "2025",
      title: "Full-Stack Developer",
      company: "LocknLock ASC & READDI",
      description: "Built ASC management system and AI-powered IELTS platform with modern Next.js and NestJS stacks.",
      type: "work",
    },
    {
      year: "2024",
      title: "Web Developer",
      company: "Quoc Bao Software Company",
      description: "Developed internal management systems for household appliance after-sales service and inventory tracking.",
      type: "work",
    },
    {
      year: "2022",
      title: "Bachelor of Software Engineering",
      company: "HUFLIT",
      description: "Studying Software Engineering at Ho Chi Minh City University of Foreign Languages – Information Technology.",
      type: "education",
    },
  ]

  const skills = [
    { name: "Frontend (React, Next.js)", level: 90, icon: Code },
    { name: "Backend (Express, NestJS)", level: 85, icon: Globe },
    { name: "Databases (PostgreSQL, Redis)", level: 80, icon: Briefcase },
    { name: "AI/Agentic (LangGraph)", level: 75, icon: Activity },
    { name: "API & Sync (TanStack Query)", level: 85, icon: Palette },
    { name: "Cloud Infrastructure (GCP)", level: 70, icon: Award },
  ]

  const achievements = [
    {
      title: "AI-Assisted Development Mastery",
      organization: "Cursor & Antigravity",
      year: "2025",
      description: "Leveraged advanced AI tools and MCP workflows to accelerate full-stack development",
    },
    {
      title: "English Proficiency",
      organization: "TOEIC",
      year: "2024",
      description: "Listening & Reading score: 535/990",
    },
    {
      title: "Full-Stack Project Delivery",
      organization: "Servexa & READDI",
      year: "2025",
      description: "Successfully built and deployed multiple robust enterprise & EdTech applications",
    },
  ]

  const certifications = [
    {
      name: "Bachelor of Software Engineering",
      issuer: "HUFLIT",
      year: "2026",
      credentialId: "EDU-2026",
    },
    {
      name: "Frontend Development Mastery",
      issuer: "Self-Taught / Experience",
      year: "2024",
      credentialId: "EXP-FE-2024",
    },
    {
      name: "Backend System Design",
      issuer: "Self-Taught / Experience",
      year: "2025",
      credentialId: "EXP-BE-2025",
    },
  ]

  return (
    <div ref={container} className="min-h-screen bg-[#15161a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#15161a]/80 backdrop-blur-md border-b border-[#2a2d36]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 text-[#717689] hover:text-[#00d2ff] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
          <h1 className="text-2xl font-bold text-balance">Career Journey</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="career-hero text-center mb-20">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#00d2ff] to-[#3a7bd5] bg-clip-text text-transparent text-balance">
            My Professional Journey
          </h2>
          <p className="text-xl text-[#aaaeb9] max-w-3xl mx-auto leading-relaxed">
            A Software Engineer with a passion for building scalable internal business systems and intelligent digital experiences. I focus on bridging the gap between complex operational requirements and intuitive user interfaces.
          </p>
        </div>

        {/* Engineering Stats */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#2a2d36] rounded-2xl p-8 text-center border border-[#3f424d] hover:border-[#00d2ff]/50 transition-colors">
                <div className="text-5xl font-bold text-[#00d2ff] mb-3 stat-counter" data-target={stat.value}>0</div>
                <div className="text-[#aaaeb9] font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Timeline */}
        <section className="mb-24 timeline-container relative">
          <h3 className="text-3xl font-bold mb-16 flex items-center justify-center text-balance">
            <Calendar className="w-8 h-8 mr-3 text-[#00d2ff]" />
            Career Milestones
          </h3>
          
          <div className="relative pl-8 md:pl-0">
            {/* Central Vertical Line */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-1 bg-[#2a2d36] md:-translate-x-1/2 rounded-full overflow-hidden">
              <div className="timeline-progress w-full h-full bg-gradient-to-b from-[#00d2ff] to-[#3a7bd5] origin-top scale-y-0" />
            </div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`milestone-item flex flex-col md:flex-row items-center w-full group ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="hidden md:block md:w-1/2" />
                    
                    {/* Node */}
                    <div className="absolute left-[15px] md:relative md:left-auto flex items-center justify-center w-9 h-9 rounded-full bg-[#15161a] border-4 border-[#2a2d36] group-hover:border-[#00d2ff] transition-colors z-10 md:mx-6 shadow-[0_0_0_4px_#15161a]">
                      <div className="w-3 h-3 bg-[#00d2ff] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>

                    <div className="w-full md:w-1/2 pl-12 md:pl-0">
                      <div className={`bg-[#2a2d36] rounded-xl p-6 border border-[#3f424d] group-hover:border-[#00d2ff]/50 transition-all group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_-15px_rgba(0,210,255,0.3)] ${
                        isEven ? 'md:mr-10' : 'md:ml-10'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-white">{milestone.title}</h4>
                          <span className="text-[#00d2ff] font-mono font-medium bg-[#00d2ff]/10 px-3 py-1 rounded-full text-sm">{milestone.year}</span>
                        </div>
                        <p className="text-[#cdffe8] font-medium mb-3 flex items-center gap-2">
                          {milestone.type === "work" ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                          {milestone.company}
                        </p>
                        <p className="text-[#aaaeb9] leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-24">
          <h3 className="text-3xl font-bold mb-12 flex items-center text-balance">
            <Code className="w-8 h-8 mr-3 text-[#00d2ff]" />
            Skills & Expertise
          </h3>
          <div className="skills-grid grid md:grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon
              return (
                <div
                  key={index}
                  className="skill-card bg-[#2a2d36] rounded-xl p-6 border border-[#3f424d] hover:border-[#00d2ff]/50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#15161a] rounded-lg group-hover:bg-[#00d2ff]/10 transition-colors">
                        <IconComponent className="w-5 h-5 text-[#00d2ff]" />
                      </div>
                      <h4 className="text-lg font-semibold">{skill.name}</h4>
                    </div>
                    <span className="text-[#cdffe8] font-mono">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-[#15161a] rounded-full h-2 overflow-hidden">
                    <div
                      className="skill-progress bg-gradient-to-r from-[#000588] to-[#00d2ff] h-full w-0 rounded-full"
                      data-width={`${skill.level}%`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-24">
          <h3 className="text-3xl font-bold mb-12 flex items-center text-balance">
            <Award className="w-8 h-8 mr-3 text-amber-400" />
            Notable Achievements
          </h3>
          <div className="achieve-grid grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="achieve-card bg-[#2a2d36] rounded-xl p-6 border border-[#3f424d] hover:border-amber-400/50 transition-all group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-400/10 rounded-xl group-hover:bg-amber-400/20 transition-colors">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-amber-400 font-mono text-sm bg-amber-400/10 px-3 py-1 rounded-full">{achievement.year}</span>
                </div>
                <h4 className="text-xl font-bold mb-2">{achievement.title}</h4>
                <p className="text-[#aaaeb9] mb-4 text-sm font-medium">{achievement.organization}</p>
                <p className="text-[#717689] text-sm leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-24">
          <h3 className="text-3xl font-bold mb-12 flex items-center text-balance">
            <GraduationCap className="w-8 h-8 mr-3 text-emerald-400" />
            Certifications & Qualifications
          </h3>
          <div className="cert-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="cert-card bg-[#2a2d36] rounded-xl p-6 border border-[#3f424d] hover:border-emerald-400/50 transition-all group"
              >
                <GraduationCap className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-bold mb-2">{cert.name}</h4>
                <p className="text-[#cdffe8] font-medium mb-3">{cert.issuer}</p>
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-[#3f424d]">
                  <span className="text-[#aaaeb9]">{cert.year}</span>
                  <span className="text-emerald-400 font-mono text-xs bg-emerald-400/10 px-2 py-1 rounded">{cert.credentialId}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#000588] to-[#00d2ff] rounded-2xl p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="text-3xl font-bold mb-4 relative z-10 text-balance">Let's Build Something Great</h3>
          <p className="text-xl mb-8 opacity-90 relative z-10 max-w-2xl mx-auto">
            Ready to bring your next product to life? I'm available for new opportunities and collaborations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-[#000588] font-bold rounded-xl hover:scale-105 transition-transform relative z-10 shadow-xl"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  )
}
