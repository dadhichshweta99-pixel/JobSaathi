import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, Briefcase, LogOut } from "lucide-react"
import useAuthStore from "../lib/authStore"
import toast from "react-hot-toast"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)

  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  /* 🔥 SCROLL ANIMATION */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      if (current < lastScroll || current < 50) {
        setVisible(true)
      } else if (current > lastScroll && current > 100) {
        setVisible(false)
        setOpen(false)
      }

      setLastScroll(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    navigate("/")
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/Jobs", label: "Jobs" },
    { to: "/AiAssistant", label: "AI Assistant" },
    { to: "/Dashboard", label: "Dashboard" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="page-container py-3">

        {/* GLASS NAV */}
        <nav className="flex items-center justify-between px-5 py-3 rounded-2xl 
                        bg-white/80 backdrop-blur-md border border-white/20 shadow-md">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold">JS</span>
            </div>
            <span className="text-lg font-bold grad-text">JobSaathi</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* AUTH */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span>{user?.name?.split(" ")[0]}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                  Sign-Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden mt-2 bg-white rounded-xl shadow p-4 space-y-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm"
              >
                {l.label}
              </NavLink>
            ))}

            <div className="flex gap-2 mt-3">
              {isAuthenticated() ? (
                <button onClick={handleLogout} className="btn-ghost w-full">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost w-full text-center">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary w-full text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  )
}