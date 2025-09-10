"use client"

import {
  ArrowLeft,
  Home,
  MousePointer,
  Globe,
  Camera,
  Linkedin,
  Github,
  TextCursor as Cursor,
  Move,
  Hand,
  Target,
  Navigation,
  Crosshair,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NavigationIconsPage() {
  const [activeState, setActiveState] = useState<string>("default")
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  const iconStates = [
    { id: "default", label: "Default", description: "Standard cursor appearance" },
    { id: "hover", label: "Hover", description: "Interactive element hover state" },
    { id: "active", label: "Active", description: "Element being clicked or selected" },
    { id: "disabled", label: "Disabled", description: "Non-interactive element state" },
    { id: "loading", label: "Loading", description: "Processing or waiting state" },
  ]

  const iconVariations = [
    { icon: MousePointer, name: "Mouse Pointer", description: "Primary navigation cursor" },
    { icon: Cursor, name: "Cursor", description: "Text selection cursor" },
    { icon: Move, name: "Move", description: "Drag and drop operations" },
    { icon: Hand, name: "Hand", description: "Clickable elements" },
    { icon: Target, name: "Target", description: "Precision selection" },
    { icon: Navigation, name: "Navigation", description: "Directional guidance" },
    { icon: Crosshair, name: "Crosshair", description: "Precise positioning" },
  ]

  const usageExamples = [
    {
      title: "Navigation Menus",
      description: "Use MousePointer for primary navigation elements and menu items",
      context: "Sidebar navigation, header menus, dropdown items",
    },
    {
      title: "Interactive Cards",
      description: "Apply hover states to project cards and clickable containers",
      context: "Portfolio cards, feature tiles, call-to-action blocks",
    },
    {
      title: "Form Elements",
      description: "Indicate interactive form fields and buttons",
      context: "Input fields, submit buttons, form controls",
    },
    {
      title: "Content Links",
      description: "Show clickable text links and inline actions",
      context: "Article links, breadcrumbs, pagination controls",
    },
  ]

  return (
    <div className="min-h-screen bg-[#15161a] text-white flex">
      {/* Sidebar */}
      <div className="w-20 flex flex-col items-center py-8">
        <div className="bg-[#2a2d36] rounded-full p-2 flex flex-col items-center space-y-4">
          <Link href="/" className="p-3 hover:bg-[#3f424d] rounded-full transition-colors">
            <Home className="w-5 h-5 text-[#717689]" />
          </Link>

          {/* Active MousePointer icon */}
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
        <div className="mb-16 animate-in fade-in duration-700">
          <h1 className="text-4xl font-bold mb-6">Navigation Icons</h1>
          <p className="text-[#aaaeb9] text-lg leading-relaxed max-w-3xl mb-8">
            Explore the MousePointer icon and its various states, behaviors, and applications within the navigation
            system. This comprehensive guide showcases how cursor interactions enhance user experience across different
            interface elements.
          </p>
        </div>

        {/* Hero MousePointer Showcase */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="bg-gradient-to-br from-[#01071a] via-[#000588] to-[#b6d2ff] rounded-2xl p-12 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="relative z-10 text-center">
              <div className="mb-8 flex justify-center">
                <div className="p-8 bg-white/10 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                  <MousePointer className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h2 className="text-5xl font-bold mb-4 group-hover:text-[#cdffe8] transition-colors duration-300">
                MousePointer
              </h2>
              <p className="text-[#cdffe8] text-xl group-hover:text-white transition-colors duration-300">
                The primary navigation cursor for interactive elements
              </p>
            </div>
          </div>
        </div>

        {/* Interactive States Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h3 className="text-2xl font-bold mb-8">Interactive States</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {iconStates.map((state) => (
              <div
                key={state.id}
                onClick={() => setActiveState(state.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeState === state.id
                    ? "bg-[#000588] border-2 border-[#b6d2ff]"
                    : "bg-[#2a2d36] hover:bg-[#3f424d] border-2 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className={`p-3 rounded-lg ${activeState === state.id ? "bg-white/20" : "bg-[#3f424d]"}`}>
                    <MousePointer
                      className={`w-5 h-5 transition-all duration-300 ${
                        state.id === "hover"
                          ? "text-[#cdffe8] scale-110"
                          : state.id === "active"
                            ? "text-white scale-95"
                            : state.id === "disabled"
                              ? "text-[#717689] opacity-50"
                              : state.id === "loading"
                                ? "text-[#b6d2ff] animate-pulse"
                                : "text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{state.label}</h4>
                  </div>
                </div>
                <p className="text-[#aaaeb9] text-sm">{state.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Icon Variations */}
        <div className="mb-16 animate-in fade-in slide-in-from-left duration-700 delay-500">
          <h3 className="text-2xl font-bold mb-8">Icon Variations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {iconVariations.map((item) => {
              const IconComponent = item.icon
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIcon(item.name)}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="p-6 bg-[#2a2d36] rounded-xl hover:bg-[#3f424d] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 bg-[#3f424d] rounded-lg group-hover:bg-[#4a4f5c] transition-colors duration-300">
                      <IconComponent
                        className={`w-6 h-6 text-[#717689] group-hover:text-white transition-all duration-300 ${
                          hoveredIcon === item.name ? "scale-110" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <p className="text-[#aaaeb9] text-xs">{item.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-16 animate-in fade-in slide-in-from-right duration-700 delay-700">
          <h3 className="text-2xl font-bold mb-8">Usage Examples</h3>
          <div className="space-y-6">
            {usageExamples.map((example, index) => (
              <div
                key={index}
                className="p-6 bg-[#2a2d36] rounded-xl hover:bg-[#3f424d] transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#3f424d] rounded-lg group-hover:bg-[#4a4f5c] transition-colors duration-300 flex-shrink-0">
                    <MousePointer className="w-5 h-5 text-[#717689] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                      {example.title}
                    </h4>
                    <p className="text-[#aaaeb9] mb-2 group-hover:text-[#cdffe8] transition-colors duration-300">
                      {example.description}
                    </p>
                    <p className="text-[#717689] text-sm group-hover:text-[#aaaeb9] transition-colors duration-300">
                      {example.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Guidelines */}
        <div className="bg-gradient-to-r from-[#2a2d36] to-[#3f424d] rounded-2xl p-10 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
          <h3 className="text-2xl font-bold mb-6">Implementation Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#cdffe8]">Best Practices</h4>
              <ul className="space-y-2 text-[#aaaeb9]">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use consistent sizing (16px, 20px, 24px) across the interface</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Apply smooth transitions (300ms) for state changes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain proper contrast ratios for accessibility</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use semantic color coding for different states</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#cdffe8]">Technical Notes</h4>
              <ul className="space-y-2 text-[#aaaeb9]">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Icons are sourced from Lucide React library</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Responsive scaling with Tailwind CSS classes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Optimized for both light and dark themes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-[#b6d2ff] rounded-full mt-2 flex-shrink-0"></div>
                  <span>Touch-friendly sizing for mobile devices</span>
                </li>
              </ul>
            </div>
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
