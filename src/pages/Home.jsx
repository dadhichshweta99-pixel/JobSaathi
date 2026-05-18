import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useAuthStore from "../lib/authStore"

export default function Home() {
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!isAuthenticated()) return navigate("/login")
    navigate(`/jobs?title=${jobTitle}&location=${location}`)
  }

  return (
    <div>

      {/* HERO */}
      <section className="bg-white py-20 md:py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          One Roof — <br />
          <span className="grad-text">
            from search to success
          </span>
        </h1>

        <p className="text-slate-500 max-w-xl mx-auto mb-10">
          Stop switching between platforms. JobSaathi brings jobs, insights,
          and AI guidance — all in one place.
        </p>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="bg-white border shadow-sm rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-xl mx-auto"
        >
          <input
            placeholder="Job title..."
            className="flex-1 px-3 text-black outline-none"
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <input
            placeholder="Location..."
            className="flex-1 px-4 py-3 rounded-xl text-black outline-none bg-slate-50 focus:ring-purple-300 transition"
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn-primary px-8 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]">
            Search</button>
        </form>

        {/* a tiny clarity section*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-10">

  <div className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="font-semibold mb-1">
      AI Resume Analysis
    </h3>

    <p className="text-sm text-slate-500">
      Improve ATS score and resume quality instantly.
    </p>
  </div>

  <div className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="font-semibold mb-1">
      Smart Job Matching
    </h3>

    <p className="text-sm text-slate-500">
      Discover jobs based on your profile and skills.
    </p>
  </div>

  <div className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="font-semibold mb-1">
      Career Guidance
    </h3>

    <p className="text-sm text-slate-500">
      Get roadmap, interview prep, and salary insights.
    </p>
  </div>

</div>

        {/* 🔥 ABOUT LINK (REPLACED STICKY SECTION) */}
        <div className="mt-12">
          <Link
            to="/about"
            className="inline-block px-6 py-3 border border-purple-200 rounded-full 
                       text-purple-600 hover: shadow-sm transition-all duration-200"
          >
            Why JobSaathi Exists →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-white to-purple-50">
        <h2 className="text-3xl font-bold mb-4">
          Start your journey with JobSaathi 🚀
        </h2>
        <p className="text-slate-500 mb-6">
          One decision today can change your entire career.
        </p>
      </section>

    </div>
  )
}