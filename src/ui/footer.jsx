import { Link } from "react-router-dom"
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">

      <div className="page-container py-6">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* BRAND */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">JS</span>
            </div>

            <p className="text-sm">
              Career growth with clarity.
            </p>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-2">
            <a href="#" className="p-2 rounded-md bg-slate-800 hover:bg-purple-600 transition">
              <FaGithub size={14} className="text-white" />
            </a>
            <a href="#" className="p-2 rounded-md bg-slate-800 hover:bg-purple-600 transition">
              <FaLinkedin size={14} className="text-white" />
            </a>
            <a href="#" className="p-2 rounded-md bg-slate-800 hover:bg-purple-600 transition">
              <FaEnvelope size={14} className="text-white" />
            </a>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800 text-xs">

          <p>© {new Date().getFullYear()} JobSaathi</p>

          {/* 🔥 YOUR SIGNATURE */}
          <div className="text-slate-500 hover:text-purple-400 transition cursor-default">
            SD
          </div>

        </div>

      </div>

    </footer>
  )
}