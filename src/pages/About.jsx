import { useEffect, useState } from "react"

export default function About() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 200)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-b from-white to-purple-50">

      {/* GLASS CARD */}
      <div
        className={`max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-100 
          shadow-lg transition-all duration-700 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Why JobSaathi Exists
          </span>
        </h1>

        <p className="text-slate-700 leading-8 text-base">

          JobSaathi was not created as just another job platform, but as a response 
          to a very common problem — the need to constantly switch between multiple 
          platforms for career growth. From searching jobs on one site, learning skills 
          on another, and trying to understand industry expectations elsewhere, the 
          journey often feels scattered and unclear.

          <br /><br />

          This platform is built to simplify that experience by bringing everything 
          into one place — job opportunities, skill guidance, and AI-driven insights. 
          It reflects a practical approach: not just helping users find jobs, but also 
          helping them understand what to learn, how to improve, and where they stand.

          <br /><br />

          JobSaathi aims to act as a companion throughout this journey — combining 
          clarity, direction, and opportunity — so that users can focus less on 
          navigating platforms and more on building their careers.

        </p>

      </div>

    </div>
  )
}