import { useState, useRef, useEffect } from "react"
import api from "../lib/api"
import toast from "react-hot-toast"
import ReactMarkdown from "react-markdown"


/* ================= MAIN COMPONENT ================= */

export default function AIAssistant() {
  const [mode, setMode] = useState("resume") // resume | jobs

  return (
    <div className="page-container py-8">

      <h1 className="text-3xl font-bold mb-6">
        AI Career Assistant 🤖
      </h1>

      {/* MODE SWITCH */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setMode("resume")}
          className={`px-5 py-2 rounded-full ${
            mode === "resume"
              ? "btn-primary"
              : "border"
          }`}
        >
          Resume Analysis
        </button>

        <button
          onClick={() => setMode("jobs")}
          className={`px-5 py-2 rounded-full ${
            mode === "jobs"
              ? "btn-primary"
              : "border"
          }`}
        >
          Job Match AI
        </button>
      </div>

      {/* CONTENT */}
      <div className="card p-0 overflow-hidden">
        {mode === "resume" ? <ResumeAI /> : <JobAI />}
      </div>
    </div>
  )
}

/* ================= RESUME AI ================= */

function ResumeAI() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
 

  const handleUpload = (e) => {
    setFile(e.target.files[0])
  }

  const analyze = async () => {
    if (!file) {
     toast.error("Please upload a resume")
      return
    }
    setLoading(true)

    try {
      const formData = new FormData()
    formData.append("resume", file)
     formData.append("mode","style") // or "demand"
     const token = localStorage.getItem("token")

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/ai/resume-analyze`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }
)
      const data = await res.json()
      //console.log("Resume Result", data)
      setResult(data)
      
    } catch (error) {
    // console.error("Resume error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4">

      <input type="file" onChange={handleUpload} />

      <button onClick={analyze} onKeyDown={analyze} className="btn-primary w-full sm:w-auto">
        Analyze Resume
      </button>

     {loading && (
  <div className="flex items-center gap-2 text-sm text-slate-500">
    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />

    <p>
      Analyzing your resume...
    </p>
  </div>
)}

      {result && (
        <div className="rounded-xl bg-slate-50 p-4">

          {/* SCORE */}
          <div className="card">
            <h3 className="font-bold">ATS Score: {result.atsScore}</h3>
          </div>

          {/* RESUME SUMMARY */}
          <div className="card">
            <h3 className="font-semibold mb-2">Resume Summary</h3>
            <p className="text-slate-600">
              {result.resumeSummary}</p>
          </div>

          {/* SUGGESTIONS */}
          <div className="card">
            <h3 className="font-semibold mb-2">Resume Improvements</h3>
            {result.resumeSuggestions?.map((s, i) => (
              <p key={i}>• {s}</p>
            ))}
          </div>

          {/* FUTURE PATH 🔥 */}
<div className="card">
  <h3 className="font-semibold mb-2">
    What to learn next ?
  </h3>

  <div className="grid gap-3 md:grid-cols-2">
    {result.futureSkills?.map((s, i) => (
      <div
        key={i}
        className="border rounded-xl p-3 bg-slate-50"
      >
        <p className="font-semibold text-lg">{s.title}</p>
<p className="text-sm text-slate-500 mt-2">{s.description}</p>
      </div>
    ))}
  </div>
</div>

        </div>
      )}
    </div>
  )
}

/* ================= JOB AI ================= */


function JobAI() {
  const [file, setFile] = useState(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedFeature, setSelectedFeature] = useState("")
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  const roles = [
  "Software & IT",
  "Management",
  "HR & Recruitment",
  "Marketing",
  "Finance",
  "Data & Analytics",
  "Operations",
  "Design & Creative",
]
  

  const features = [
    "Interview Prep",
    "Career Roadmap",
    "Salary Insights",
  ]

  const handleUpload = (e) => {
    setFile(e.target.files[0])
  }

  const generateAIResponse = async (role, feature) => {
    setLoading(true)

    try {
      const prompt = `
You are an AI Career Coach.

The user wants guidance for:
Role: ${role}
Feature: ${feature}

Give practical and structured guidance in markdown format.
`
const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify({
          message: prompt,
        
        }),
      })

      const data = await res.json()

      setMessages([
        {
          role: "assistant",
          text: data.reply,
        },
      ])
    } catch (error) {
   //   console.error(error)
      toast.error("AI failed")
    } finally {
      setLoading(false)
    }
  }

  const sendCustomQuestion = async () => {
    if (!input.trim()) return

    const userMsg = {
      role: "user",
      text: input,
    }

    setMessages((m) => [...m, userMsg])

    setLoading(true)

    try {
      const prompt = `
Role: ${selectedRole}

User Question:
${input}
`
const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: prompt,
        }),
      })

      const data = await res.json()

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.reply,
        },
      ])

      setInput("")
    } catch (error) {
    //  console.error(error)
      toast.error("AI failed")
    } finally {
      setLoading(false)
    }
   }
   useEffect(()=>{
 bottomRef.current?.scrollIntoView({
  behavior: "smooth",
}) 
},[messages])

  return (
    <div className="p-6 space-y-6">

      {/* RESUME UPLOAD */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
        <h2 className="font-bold text-xl mb-3">
          Upload Resume Before Using AI Features
        </h2>

        <input type="file" onChange={handleUpload} />

        {file && (
          <p className="text-sm text-slate-500 mt-2">
            Resume uploaded: {file.name}
          </p>
        )}
      </div>

      {/* ROLE SELECTION */}
      <div className="rounded-2xl border p-5 bg-white">
        <h2 className="font-bold text-xl mb-4">
          Select Your Career Path
        </h2>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                 if (!file) {
             toast.error("Upload resume first")
             return
              }setSelectedRole(role)
              setMessages([])
              }}
              className={`p-4 rounded-xl border transition ${
                selectedRole === role
                  ? "bg-purple-600 text-white"
                  : "bg-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURE BUTTONS */}
      {selectedRole && (
        <div className="rounded-2xl bg-slate-50 p-5">
          <h2 className="font-bold text-xl mb-4">
            AI Career Tools
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            {features.map((feature) => (
              <button
              disabled={loading} 
                key={feature}
                onClick={() => {
                  setSelectedFeature(feature)
                  generateAIResponse(selectedRole, feature)
                }}
                className={`p-4 rounded-xl border transition-all duration-200 
                  ${loading? "opacity-70 cursor-not-allowed":""}
                  ${
                  selectedFeature === feature
                    ? "bg-purple-600 text-white"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>
      )}
{/* Empty start state*/}
{messages.length === 0 && selectedRole && (
  <div className="text-center py-8 text-slate-500">
    Choose an AI tool to get started 🚀
  </div>
)}
      {/* AI RESPONSE */}
      {messages.length > 0 && (
        <div className="card space-y-5 border-purple-100">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "text-right"
                  : ""
              }
            >
              <div
  className={`inline-block px-4 py-3 rounded-2xl max-w-3xl font-sans 
    text-sm leading-7 border ${ m.role === "assistant"
      ? "bg-purple-50 border-purple-100 text-slate-700"
      : "bg-slate-100 border-slate-200 text-slate-700"
  }`} >
                <ReactMarkdown>
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOM QUESTION */}
      {selectedRole && (
        <div className="rounded-2xl border p-5 bg-white">
          <h2 className="font-bold text-lg mb-3">
            Ask Custom Career Question
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="input-field flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  sendCustomQuestion()
                }
              }}
              placeholder="Ask anything about your career..."
            />

            <button
            disabled={loading}
              onClick={sendCustomQuestion}
              className={`btn-primary ${
                loading ? "opacity-70 cursor-not-allowed":""
              }`}
            >
              Ask
            </button>
          </div>
        </div>
      )}
     
{loading && (
<div className="flex items-center gap-2 text-sm text-slate-500">
  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
  AI is generating personalized guidance...
</div>

      )}
      <div ref={bottomRef} />
      </div>
    
  )
}