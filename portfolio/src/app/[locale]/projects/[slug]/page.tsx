import { ArrowLeft, Home, MousePointer, Globe, Camera } from 'lucide-react'
import { Github, Linkedin } from '@/common/components/atoms/icons'
import Link from "next/link"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

import { projects } from '@/common/utils/string'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = decodeURIComponent(resolvedParams.slug)

  const stringProject = projects.find((p) => p.id === slug || p.title.toLowerCase() === slug.toLowerCase())

  if (!stringProject) {
    return (
      <div className="p-10 text-white">
        <h1>Project not found</h1>
        <p>Received slug: "{slug}"</p>
        <p>Available projects: {projects.map(p => p.id).join(', ')}</p>
      </div>
    )
  }

  const project = {
    title: stringProject.title,
    subtitle: stringProject.subtitle,
    description: stringProject.description,
    heroGradient: stringProject.gradient,
    sections: [
      {
        title: "Project Overview",
        subtitle: stringProject.projectType,
        content: `Tech Stack: ${stringProject.techStack}. ${stringProject.architectureHighlights}`,
        details: `Key Metrics: ${stringProject.keyMetrics}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#15161a] text-white flex">
      {/* Sidebar */}
      <div className="w-20 flex flex-col items-center py-8">
        <div className="bg-[#2a2d36] rounded-full p-2 flex flex-col items-center space-y-4">
          <Link href="/" className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Home className="w-5 h-5 text-[#717689]" />
          </Link>

          <div className="p-3 bg-[#3f424d] rounded-full">
            <MousePointer className="w-5 h-5 text-white" />
          </div>
          <div className="w-1 h-1 bg-white rounded-full"></div>

          <div className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Globe className="w-5 h-5 text-[#717689]" />
          </div>
          <div className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Camera className="w-5 h-5 text-[#717689]" />
          </div>

          <div className="w-6 h-px bg-[#3f424d] my-2"></div>

          <div className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Linkedin className="w-5 h-5 text-[#717689]" />
          </div>
          <div className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Github className="w-5 h-5 text-[#717689]" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-12 py-8">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[#aaaeb9] hover:text-white transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="group-hover:translate-x-0.5 transition-transform duration-300">Back to portfolio</span>
        </Link>

        {/* Header Section */}
        <div className="mb-12 animate-in fade-in duration-700">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-[#aaaeb9] text-lg leading-relaxed max-w-3xl">{project.description}</p>
        </div>

        {/* Hero Project Card */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="bg-[#656a7b] rounded-2xl p-8 relative overflow-hidden h-80 group cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.heroGradient} opacity-90 group-hover:opacity-95 transition-opacity duration-500`}
            ></div>
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                <h2 className="text-5xl font-bold mb-3 group-hover:text-[#cdffe8] transition-colors duration-300">
                  Project 1
                </h2>
                <p className="text-[#cdffe8] text-lg group-hover:text-white transition-colors duration-300">
                  {project.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3">{project.sections[0].title}</h3>
              <h4 className="text-lg text-[#aaaeb9] mb-4">{project.sections[0].subtitle}</h4>
              <p className="text-[#aaaeb9] leading-relaxed mb-4">{project.sections[0].content}</p>
              <p className="text-[#aaaeb9] leading-relaxed">{project.sections[0].details}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#3f424d] rounded-xl h-48 flex items-center justify-center hover:bg-[#4a4f5c] transition-all duration-300 cursor-pointer group">
              <span className="text-[#717689] group-hover:text-white transition-colors duration-300">
                Project Image
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#3f424d] rounded-xl h-24 flex items-center justify-center hover:bg-[#4a4f5c] transition-all duration-300 cursor-pointer group">
                <span className="text-[#717689] text-sm group-hover:text-white transition-colors duration-300">
                  Detail
                </span>
              </div>
              <div className="bg-[#3f424d] rounded-xl h-24 flex items-center justify-center hover:bg-[#4a4f5c] transition-all duration-300 cursor-pointer group">
                <span className="text-[#717689] text-sm group-hover:text-white transition-colors duration-300">
                  Detail
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section with Blue Background */}
        <div className="bg-gradient-to-r from-[#01071a] to-[#000588] rounded-2xl p-10 mb-16 animate-in fade-in slide-in-from-left duration-700 delay-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer group">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-3 group-hover:text-[#cdffe8] transition-colors duration-300">
              Section title:
            </h3>
            <h4 className="text-xl text-[#b6d2ff] mb-6 group-hover:text-white transition-colors duration-300">
              And a subtitle
            </h4>
            <p className="text-[#cdffe8] leading-relaxed group-hover:text-white transition-colors duration-300">
              Explore an interactive feature of the project and show some visual elements to showcase your detailed
              creative in a process.
            </p>
          </div>
        </div>

        {/* Large Image Section */}
        <div className="mb-16">
          <div className="bg-[#3f424d] rounded-2xl h-[400px] flex items-center justify-center mb-6 relative overflow-hidden">
            <span className="text-[#717689] text-lg">Featured Project Image</span>
          </div>
          <div className="flex items-center space-x-2 text-[#717689] text-sm">
            <div className="w-2 h-2 bg-[#717689] rounded-full"></div>
            <span>Image caption or description</span>
          </div>
        </div>

        {/* Grid Gallery Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Section title:</h3>
          <h4 className="text-lg text-[#aaaeb9] mb-8">And a subtitle</h4>
          <p className="text-[#aaaeb9] leading-relaxed mb-12 max-w-2xl">
            Explore an interactive feature of the project and show some visual elements to showcase your detailed
            creative in a process.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#3f424d] rounded-xl aspect-square flex items-center justify-center hover:bg-[#4a4f5c] transition-colors duration-200"
              >
                <span className="text-[#717689] text-sm">Image {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Different Styles Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Section title</h3>
          <h4 className="text-lg text-[#aaaeb9] mb-8">with different styles</h4>
          <p className="text-[#aaaeb9] leading-relaxed mb-12 max-w-2xl">
            Explore an interactive feature of the project and show some visual elements to showcase your detailed
            creative in a process.
          </p>

          <div className="bg-[#3f424d] rounded-2xl h-[350px] flex items-center justify-center relative overflow-hidden">
            <span className="text-[#717689] text-lg">Style Showcase</span>
          </div>
        </div>

        {/* Takeaway Section */}
        <div className="bg-gradient-to-br from-[#000588] via-[#01071a] to-[#b6d2ff] rounded-2xl p-10 mb-16 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer group">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#cdffe8] transition-colors duration-300">
              Takeaway:
            </h3>
            <h4 className="text-xl text-[#b6d2ff] mb-6 group-hover:text-white transition-colors duration-300">
              And a subtitle
            </h4>
            <p className="text-[#cdffe8] leading-relaxed group-hover:text-white transition-colors duration-300">
              Write about what you've learned during this project, what are the key takeaways and how this project has
              influenced your approach to future work.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#717689] text-sm">
          <p className="mb-1">
            Brought to you be <span className="text-white font-medium">Once UI</span>
          </p>
          <p>
            Created by <span className="text-white font-medium">Lorant Toth</span>
          </p>
        </div>
      </div>
    </div>
  )
}
