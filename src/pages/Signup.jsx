import { useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import api from "../lib/api"
import toast from "react-hot-toast"



export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading]= useState(false)
const navigate = useNavigate()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSignup = async (e) => {
    e.preventDefault()
      if (!emailRegex.test(form.email)) {
  toast.error("Enter a valid email address")
  return
}setLoading(true)
try {
      await api.post("/auth/register", form)
      toast.success("Account created")
      setForm({
        name:"",
        email:"",
        password:"",
      })
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.message ||"Signup failed")
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="card w-full max-w-md p-8">

        <h2 className="text-2xl font-bold mb-2">Create Account 🚀</h2>
        <p className="text-slate-500 mb-6">Create your JobSaathi account</p>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            className="input-field"
            placeholder="Full Name"
            autoComplete="name"
            value ={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input-field"
            placeholder="Email"
            type="email"
            autoComplete="email"
             value ={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="input-field"
            placeholder="Password"
            type="password"
            autoComplete="new-password"
             value ={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="text-xs text-slate-400 px-1">
            Password must be at least 6 characters
          </p>

    <button disabled={loading} className={`btn-primary w-full ${
    loading ? "opacity-70 cursor-not-allowed"
      : "" }`} >
  {loading ? "Creating Account..." : "Sign Up"}
</button>
  </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}