"use client";
import Link from "next/link";
import { useState } from "react";
import { Camera, Globe, Home, MousePointer, Mail } from 'lucide-react'
import { Github, Linkedin } from '../../atoms/icons'

import Tooltip from "../../atoms/tooltip/tooltip";

export function Sidebar() {
    const [clickedButton, setClickedButton] = useState<string | null>(null)

    const handleButtonClick = (buttonId: string) => {
        setClickedButton(buttonId)
        setTimeout(() => setClickedButton(null), 200)
    }

    return (
        <div className="w-20 flex flex-col items-center py-8 sticky top-8 h-fit">
        <div className="bg-[#2a2d36] rounded-full p-2 flex flex-col items-center space-y-4">
          {/* Active home icon with highlight */}
          <Tooltip content="Home">
            <div
              className={`p-3 bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${
                clickedButton === "home" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("home")}
            >
              <Home className="w-5 h-5 text-white" />
            </div>
          </Tooltip>

          {/* Active indicator dot */}
          <div className="w-1 h-1 bg-white rounded-full"></div>

          {/* Navigation icons */}
          <Tooltip content="Navigation Icons">
            <Link
              href="/navigation-icons"
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${
                clickedButton === "mouse" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("mouse")}
            >
              <MousePointer className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </Link>
          </Tooltip>
        
          <Tooltip content="Photography">
            <div
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${
                clickedButton === "camera" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("camera")}
            >
              <Camera className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </div>
          </Tooltip>
          <Tooltip content="Career Journey">
            <Link
              href="/career"
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${
                clickedButton === "career" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("career")}
            >
              <Globe className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </Link>
          </Tooltip>

          <Tooltip content="Contact Me">
            <Link
              href="/contact"
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 ${
                clickedButton === "contact" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("contact")}
            >
              <Mail className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </Link>
          </Tooltip>

          {/* Divider line */}
          <div className="w-6 h-px bg-[#3f424d] my-2"></div>

          {/* Social icons */}
          <Tooltip content="LinkedIn Profile">
            <div
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${
                clickedButton === "linkedin" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("linkedin")}
            >
              <Linkedin className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </div>
          </Tooltip>
          <Tooltip content="GitHub Repository">
            <div
              className={`p-3 hover:bg-[#3f424d] rounded-full transition-all duration-200 cursor-pointer ${
                clickedButton === "github" ? "scale-90 bg-[#4a4d58]" : ""
              }`}
              onClick={() => handleButtonClick("github")}
            >
              <Github className="w-5 h-5 text-[#717689] hover:text-white transition-colors" />
            </div>
          </Tooltip>
        </div>
      </div>
    )
}