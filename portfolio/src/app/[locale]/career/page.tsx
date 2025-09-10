"use client"

import { ArrowLeft, Calendar, Award, Briefcase, GraduationCap, Code, Palette, Camera, Globe } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CareerPage() {
  const milestones = [
    {
      year: "2024",
      title: "Senior Product Designer",
      company: "Tech Innovation Co.",
      description: "Leading design systems and user experience for enterprise applications",
      type: "work",
    },
    {
      year: "2023",
      title: "UX/UI Designer",
      company: "Creative Studio",
      description: "Designed digital experiences for Fortune 500 companies",
      type: "work",
    },
    {
      year: "2022",
      title: "Freelance Designer",
      company: "Independent",
      description: "Built portfolio working with startups and small businesses",
      type: "work",
    },
    {
      year: "2021",
      title: "Bachelor of Design",
      company: "Design University",
      description: "Graduated with honors in Digital Design and User Experience",
      type: "education",
    },
  ]

  const skills = [
    { name: "Product Design", level: 95, icon: Palette },
    { name: "User Experience", level: 90, icon: Globe },
    { name: "Photography", level: 85, icon: Camera },
    { name: "Frontend Development", level: 80, icon: Code },
    { name: "Digital Art", level: 88, icon: Briefcase },
    { name: "Brand Identity", level: 82, icon: Award },
  ]

  const achievements = [
    {
      title: "Design Excellence Award",
      organization: "Design Institute",
      year: "2024",
      description: "Recognized for outstanding contribution to user experience design",
    },
    {
      title: "Best Portfolio",
      organization: "Creative Awards",
      year: "2023",
      description: "Selected as one of the top 10 portfolios in digital design",
    },
    {
      title: "Innovation in Design",
      organization: "Tech Conference",
      year: "2023",
      description: "Speaker at major design conference on emerging design trends",
    },
  ]

  const certifications = [
    {
      name: "Google UX Design Certificate",
      issuer: "Google",
      year: "2023",
      credentialId: "GUX-2023-001",
    },
    {
      name: "Adobe Certified Expert",
      issuer: "Adobe",
      year: "2022",
      credentialId: "ACE-2022-456",
    },
    {
      name: "Figma Advanced Certification",
      issuer: "Figma",
      year: "2023",
      credentialId: "FIG-ADV-789",
    },
  ]

  return (
    <div className="min-h-screen bg-[#15161a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#15161a]/80 backdrop-blur-md border-b border-[#2a2d36]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 text-[#717689] hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
          <h1 className="text-2xl font-bold">Career Journey</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#b6d2ff] to-[#cdffe8] bg-clip-text text-transparent">
            My Professional Journey
          </h2>
          <p className="text-xl text-[#aaaeb9] max-w-3xl mx-auto leading-relaxed">
            A passionate designer and developer with over 5 years of experience creating meaningful digital experiences.
            I specialize in bridging the gap between beautiful design and functional technology.
          </p>
        </motion.div>

        {/* Career Timeline */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold mb-12 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-[#b6d2ff]" />
            Career Milestones
          </h3>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-6 group"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.type === "work" ? "bg-[#000588]" : "bg-emerald-600"
                    } group-hover:scale-110 transition-transform`}
                  >
                    {milestone.type === "work" ? (
                      <Briefcase className="w-6 h-6 text-white" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-1 bg-[#2a2d36] rounded-xl p-6 group-hover:bg-[#3f424d] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold">{milestone.title}</h4>
                    <span className="text-[#b6d2ff] font-medium">{milestone.year}</span>
                  </div>
                  <p className="text-[#cdffe8] font-medium mb-2">{milestone.company}</p>
                  <p className="text-[#aaaeb9]">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold mb-12 flex items-center">
            <Code className="w-8 h-8 mr-3 text-[#cdffe8]" />
            Skills & Expertise
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#2a2d36] rounded-xl p-6 hover:bg-[#3f424d] transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-6 h-6 text-[#b6d2ff] group-hover:scale-110 transition-transform" />
                      <h4 className="text-lg font-semibold">{skill.name}</h4>
                    </div>
                    <span className="text-[#cdffe8] font-medium">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-[#15161a] rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="bg-gradient-to-r from-[#000588] to-[#b6d2ff] h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold mb-12 flex items-center">
            <Award className="w-8 h-8 mr-3 text-amber-400" />
            Notable Achievements
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#2a2d36] to-[#3f424d] rounded-xl p-6 hover:shadow-xl hover:shadow-amber-400/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-amber-400 font-medium">{achievement.year}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">{achievement.title}</h4>
                <p className="text-[#cdffe8] font-medium mb-2">{achievement.organization}</p>
                <p className="text-[#aaaeb9] text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold mb-12 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-emerald-400" />
            Certifications & Qualifications
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#2a2d36] rounded-xl p-6 border border-[#3f424d] hover:border-emerald-400/30 transition-colors group"
              >
                <GraduationCap className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold mb-2">{cert.name}</h4>
                <p className="text-[#cdffe8] font-medium mb-2">{cert.issuer}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#aaaeb9]">{cert.year}</span>
                  <span className="text-emerald-400 font-mono text-xs">{cert.credentialId}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center bg-gradient-to-r from-[#000588] via-purple-600 to-[#b6d2ff] rounded-2xl p-12"
        >
          <h3 className="text-3xl font-bold mb-4">Let's Work Together</h3>
          <p className="text-xl mb-8 opacity-90">
            Ready to bring your next project to life? I'd love to hear about your ideas.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-[#000588] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
