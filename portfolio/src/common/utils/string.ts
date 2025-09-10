import { Camera, Globe, MousePointer } from "lucide-react"

export const YourName = "John Nguyễn"

export const projects = [
    {
      id: "design-projects",
      title: "Design projects",
      subtitle: "Replace with cover",
      category: "Design",
      description: "My design projects",
      icon: MousePointer,
      gradient: "from-[#01071a] via-[#000588] to-[#b6d2ff]",
      hoverColors: {
        title: "group-hover:text-[#cdffe8]",
        subtitle: "group-hover:text-[#b6d2ff]",
        description: "group-hover:text-[#b6d2ff]",
      },
      shadowColor: "group-hover:shadow-blue-500/10",
    },
    {
      id: "art-projects",
      title: "Art projects",
      subtitle: "Replace with cover",
      category: "Art",
      description: "My art projects",
      icon: Globe,
      gradient: "from-[#000588] via-purple-600 to-orange-500",
      hoverColors: {
        title: "group-hover:text-white",
        subtitle: "group-hover:text-orange-200",
        description: "group-hover:text-orange-200",
      },
      shadowColor: "group-hover:shadow-purple-500/10",
    },
    {
      id: "photography-projects",
      title: "Photography",
      subtitle: "Visual stories",
      category: "Photo",
      description: "My photography work",
      icon: Camera,
      gradient: "from-emerald-600 via-teal-500 to-cyan-400",
      hoverColors: {
        title: "group-hover:text-white",
        subtitle: "group-hover:text-cyan-200",
        description: "group-hover:text-cyan-200",
      },
      shadowColor: "group-hover:shadow-emerald-500/10",
    },
    {
      id: "web-projects",
      title: "Web projects",
      subtitle: "Digital experiences",
      category: "Web",
      description: "My web development",
      icon: Globe,
      gradient: "from-rose-500 via-pink-500 to-violet-500",
      hoverColors: {
        title: "group-hover:text-white",
        subtitle: "group-hover:text-pink-200",
        description: "group-hover:text-pink-200",
      },
      shadowColor: "group-hover:shadow-rose-500/10",
    },
    {
      id: "branding-projects",
      title: "Branding",
      subtitle: "Identity design",
      category: "Brand",
      description: "My branding work",
      icon: MousePointer,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      hoverColors: {
        title: "group-hover:text-white",
        subtitle: "group-hover:text-amber-200",
        description: "group-hover:text-amber-200",
      },
      shadowColor: "group-hover:shadow-amber-500/10",
    },
  ]