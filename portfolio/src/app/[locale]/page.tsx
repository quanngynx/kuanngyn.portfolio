"use client";

import Tooltip from "@/common/components/atoms/tooltip/tooltip";
import { projects, YourName } from "@/common/utils/string";
// import { IntroPage } from '@/common/components/organisms/home';
// import { PageLayoutPortfolio } from '@/common/components/templates';
// import { ContactPage } from '@/common/components/organisms/contact';
// import { Copyright } from '@/common/components/organisms/copyright';

import { Home, MousePointer, Globe, Camera, ChevronLeft, ChevronRight, Mail, Download, Folder } from 'lucide-react'
import { Github, Linkedin } from '@/common/components/atoms/icons'
import Link from "next/link";
import { useRef, useState, useEffect } from "react"
import { useParams } from "next/navigation";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/common/utils/motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
    const container = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [clickedButton, setClickedButton] = useState<string | null>(null)
    const params = useParams<{ locale: string }>()
    const locale = params?.locale ?? ""
    const prefersReducedMotion = useReducedMotion()

    useGSAP(() => {
        if (prefersReducedMotion) return;

        const tl = gsap.timeline();
        tl.from(".hero-name", { y: 30, opacity: 0, duration: 0.6, ease: "power4.out" })
            .from(".hero-role", { y: 30, opacity: 0, duration: 0.5, ease: "power4.out" }, "-=0.2")
            .from(".hero-desc", { y: 30, opacity: 0, duration: 0.5, ease: "power4.out" }, "-=0.2")
            .from(".hero-actions", { y: 30, opacity: 0, duration: 0.4, ease: "power4.out" }, "-=0.2");

        gsap.utils.toArray('.project-card').forEach((card: any, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
                duration: 0.7,
                delay: i * 0.12,
                ease: "power3.out"
            });
        });
    }, { scope: container });

    const handleButtonClick = (buttonId: string) => {
        setClickedButton(buttonId)
        setTimeout(() => setClickedButton(null), 200)
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" })
        }
    }
    return (
        <div ref={container} className="min-h-screen bg-[#15161a] text-white flex relative overflow-hidden">
            {/* Animated Glow Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,210,255,0.05) 0%, rgba(21,22,26,0) 60%)' }}></div>
            {/* Sidebar */}
            <div className="w-20 flex flex-col items-center py-8 sticky top-8 h-fit">
                <div className="bg-[#2a2d36] rounded-full p-2 flex flex-col items-center space-y-4">
                    {/* Active home icon with highlight */}
                    <Tooltip content="Home">
                        <Link
                            href={`/${locale}`}
                            className={`flex items-center justify-center p-3 bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${clickedButton === "home" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("home")}
                            aria-label="Home"
                        >
                            <Home className="w-5 h-5 text-white" />
                        </Link>
                    </Tooltip>

                    {/* Active indicator dot */}
                    <div className="w-1 h-1 bg-white rounded-full"></div>

                    {/* Navigation icons */}
                    <Tooltip content="Navigation Icons">
                        <Link
                            href={`/${locale}/navigation-icons`}
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${clickedButton === "mouse" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("mouse")}
                            aria-label="Navigation Icons"
                        >
                            <MousePointer className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </Link>
                    </Tooltip>

                    <Tooltip content="Photography">
                        <button
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${clickedButton === "camera" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("camera")}
                            aria-label="Photography"
                        >
                            <Camera className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Career Journey">
                        <Link
                            href={`/${locale}/career`}
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${clickedButton === "career" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("career")}
                            aria-label="Career Journey"
                        >
                            <Globe className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </Link>
                    </Tooltip>

                    <Tooltip content="Contact Me">
                        <Link
                            href={`/${locale}/contact`}
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${clickedButton === "contact" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("contact")}
                            aria-label="Contact Me"
                        >
                            <Mail className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </Link>
                    </Tooltip>

                    {/* Divider line */}
                    <div className="w-6 h-px bg-[#3f424d] my-2"></div>

                    {/* Social icons */}
                    <Tooltip content="LinkedIn Profile">
                        <a
                            href="https://linkedin.com/in/quan-nguyen-fcj"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${clickedButton === "linkedin" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("linkedin")}
                            aria-label="LinkedIn Profile"
                        >
                            <Linkedin className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </a>
                    </Tooltip>
                    <Tooltip content="GitHub Repository">
                        <a
                            href="https://github.com/quanngynx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${clickedButton === "github" ? "scale-90 bg-[#4a4d58]" : ""}`}
                            onClick={() => handleButtonClick("github")}
                            aria-label="GitHub Repository"
                        >
                            <Github className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
                        </a>
                    </Tooltip>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-12 py-6 overflow-y-auto">
                {/* Header Section */}
                <div className="mb-8 relative z-10">
                    <h1 className="hero-name text-4xl font-bold mb-4 text-balance">{YourName}</h1>
                    <h2 className="hero-role text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] mb-6 text-balance">
                        Software Engineer
                    </h2>
                    <p className="hero-desc text-[#aaaeb9] text-lg leading-relaxed max-w-2xl mb-6">
                        A dynamic web developer with hands-on experience building internal business operation systems. Experienced in developing management dashboards, warranty workflows, inventory modules, permission-based systems, and AI-assisted operation tools.
                    </p>
                    <div className="hero-actions flex flex-wrap gap-4">
                        <Link href="/resume.pdf" target="_blank" className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-xl text-white font-semibold hover:scale-105 transition-transform">
                            <Download className="w-5 h-5" />
                            <span>Download Resume</span>
                        </Link>
                        {/* <button onClick={() => {
                            handleButtonClick("scroll-right")
                            scrollRight()
                        }}
                            className="flex items-center space-x-2 px-6 py-3 bg-[#2a2d36] hover:bg-[#3f424d] rounded-xl text-white font-semibold hover:scale-105 transition-transform">
                            <Folder className="w-5 h-5" />
                            <span>View Projects</span>
                        </button> */}
                        <Link href={`/${locale}/contact`} className="flex items-center space-x-2 px-6 py-3 border border-[#3f424d] hover:border-[#00d2ff] hover:text-[#00d2ff] rounded-xl text-white font-semibold hover:scale-105 transition-colors duration-300">
                            <Mail className="w-5 h-5" />
                            <span>Contact Me</span>
                        </Link>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Projects</h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    handleButtonClick("scroll-left")
                                    scrollLeft()
                                }}
                                className={`p-2 bg-[#2a2d36] hover:bg-[#3f424d] rounded-full transition-all duration-200 group ${clickedButton === "scroll-left" ? "scale-90 bg-[#4a4d58]" : ""
                                    }`}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#717689] group-hover:text-white transition-colors" />
                            </button>
                            <button
                                onClick={() => {
                                    handleButtonClick("scroll-right")
                                    scrollRight()
                                }}
                                className={`p-2 bg-[#2a2d36] hover:bg-[#3f424d] rounded-full transition-all duration-200 group ${clickedButton === "scroll-right" ? "scale-90 bg-[#4a4d58]" : ""
                                    }`}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5 text-[#717689] group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {projects.map((project) => {
                            const IconComponent = project.icon
                            return (
                                <Link key={project.id} href={`/${locale}/projects/${project.id}`} className="project-card block group flex-shrink-0">
                                    <div
                                        className={`bg-[#656a7b] rounded-2xl p-6 relative overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${project.shadowColor} cursor-pointer w-80 h-60`}
                                    >
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80 group-hover:opacity-95 transition-all duration-500`}
                                        ></div>
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex-1 flex items-center justify-center min-h-0">
                                                <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                                                    <h3
                                                        className={`text-4xl font-bold mb-2 ${project.hoverColors.title} transition-colors duration-300 text-balance`}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                    <p
                                                        className={`text-[#aaaeb9] ${project.hoverColors.subtitle} transition-colors duration-300`}
                                                    >
                                                        {project.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 mt-4 transform group-hover:translate-x-1 transition-transform duration-300">
                                                <div className="p-2 bg-black/20 rounded-lg backdrop-blur-sm">
                                                    <IconComponent className="w-4 h-4 text-[#aaaeb9] group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium group-hover:text-white transition-colors duration-300 truncate">
                                                        {project.category}
                                                    </p>
                                                    <p
                                                        className={`text-xs text-[#aaaeb9] ${project.hoverColors.description} transition-colors duration-300 truncate mb-1`}
                                                    >
                                                        {project.description}
                                                    </p>
                                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                                                        <p className="text-[10px] text-white truncate"><span className="text-white font-medium">Stack:</span> {project.techStack}</p>
                                                        <p className="text-[10px] text-white truncate"><span className="text-white font-medium">Metrics:</span> {project.keyMetrics}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Scroll indicator dots */}
                    <div className="flex justify-center mt-1 space-x-2">
                        {projects.map((_, index) => (
                            <div
                                key={index}
                                className="w-2 h-2 bg-[#3f424d] rounded-full transition-colors duration-200 hover:bg-[#717689]"
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[#717689] text-sm">
                    <p>
                        Created by <span className="text-white font-medium">Lorant Toth</span>
                    </p>
                </div>
            </div>
        </div>
    );
}