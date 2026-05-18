import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../lib/api"
import toast from "react-hot-toast"
import useAuthStore from "../lib/authStore"   // ✅ ADDED

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()              // ✅ ADDED
  const login = useAuthStore((s) => s.login)  // ✅ ADDED


  const handleLogin = async (e) => {
    e.preventDefault()

  
setLoading(true)
    // 🔥 EXISTING BACKEND LOGIN (UNCHANGED)
    try {
     // await api.post("/auth/login", form)
      await login(form.email, form.password)
      toast.success("Login successful")
      navigate("/")
    } catch {
      toast.error("Invalid credentials")
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="card w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-2">Welcome Back 👋</h2>
        <p className="text-slate-500 mb-6">Login to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">

  <input
  className="input-field"
  placeholder="Email"
  type="email"
  value={form.email}
  autoComplete="email"
  onChange={(e) =>
    setForm({ ...form, email: e.target.value })
  } />

   <input
  className="input-field"
  placeholder="Password"
  type="password"
  value={form.password}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  } />

          <button
  disabled={loading}
  className={`btn-primary w-full ${
    loading
      ? "opacity-70 cursor-not-allowed"
      : ""
  }`} >
  {loading ? "Logging in..." : "Login"}
</button>

          {/* 🔥 DEMO BUTTON (FIXED) */}
          
        </form>

        {/* 🔥 DEMO CREDENTIAL INFO (NEW, OPTIONAL) */}
       {/* <p className="text-xs text-center mt-4 text-slate-500">
          Demo: demo@jobsaathi.com / 123456  
         Try demo mode to explore the platform instantly.
        </p> */}

        <p className="text-sm text-center mt-4">
          New user?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}