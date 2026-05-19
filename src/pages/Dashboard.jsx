import { useState, useEffect } from "react"
import api from "../lib/api"
import useAuthStore from "../lib/authStore"
import {Trash2} from "lucide-react"

/*  COMPONENTS  */

function StatCard({ label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`} />
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  )
}

function JobCard({ job , onDelete}) {
  return (
    <div className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <p className="font-semibold">{job.title}</p>
      <p className="text-sm text-slate-500">{job.company}</p>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>{job.location}</span>
        <span>{job.salary || ""}</span>
      </div>
      {onDelete && (
  <button
    onClick={() => onDelete(job._id)}
    className="mt-3 text-red-500 text-sm flex items-center gap-1 hover: text-red-600 transition"
  >
    <Trash2 size={14} />
    Remove
  </button>
)}
    </div>
  )
}

/* MAIN DASHBOARD  */

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)

  const [tab, setTab] = useState("overview")
  const [data, setData] = useState({
    stats: {},
    savedJobs: [],
    recommended: [],
  })
  const removeSavedJob = (id) => {
  setData((prev) => ({
    ...prev,
    savedJobs: prev.savedJobs.filter(
      (job) => job._id !== id
    ),
  }))
}

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, savedRes] = await Promise.all([
          api.get("/users/stats"),
          api.get("/users/saved-jobs")
        ])
console.log("STATS RESPONSE:", statsRes.data)
        setData({
          stats: statsRes.data,
          savedJobs: savedRes.data.jobs || [],
          
          recommended: statsRes.data.recommended || [],
        })
      } catch {
        // console.log("Error loading dashboard")
      }
    }
    load()
  }, [])

  return (
    <div className="page-container py-8 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm">
            Track your job journey here
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        {["overview", "saved",  "profile"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === t
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : "bg-slate-50 hover:bg-slate-100 transition"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Saved Jobs" value={data.stats.saved || 0} color="bg-purple-100" />
            <StatCard label=" ATS Match %" value={data.stats.matchScore || 0} color="bg-yellow-100" />
          </div>

          {/* PROFILE COMPLETION */}
          <div className="card">
            <p className="mb-2 text-sm text-slate-500">Profile Completion</p>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${user?.profileCompletion || 60}%` }}
              />
            </div>
          </div>

          {/* RECOMMENDED JOBS */}
          <div>
            <h2 className="font-semibold mb-3">Recommended Jobs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.recommended.length > 0 ? (
                data.recommended.map((job, i) => (
                  <JobCard key={i} job={job} />
                ))
              ) : (
                <p className="text-slate-400 py-6">
          Upload your resume to unlock personalized recommendations 🚀</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SAVED */}
      {tab === "saved" && (
        <div className="space-y-4">
          {data.savedJobs.length > 0 ? (
  data.savedJobs.map((job) => (
    <JobCard
      key={job._id}
      job={job}
      onDelete={removeSavedJob}/>
  ))
) : (
  <p className="text-slate-400 text-center py-10">
    No saved jobs yet 🚀</p>
)} 
</div>
      )}

      {/* APPLIED */}
     {/* {tab === "applied" && (
        <div className="space-y-4">
          {data.appliedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )} */}

      {/* PROFILE */}
      {tab === "profile" && (
        <div className="card max-w-md space-y-4">
          <p className="text-sm text-slate-500">
  Manage your account information</p>
          <input className="input-field" defaultValue={user?.name} placeholder="Name" />
          <input className="input-field" defaultValue={user?.email} placeholder="Email" />
          <button className="btn-primary w-full">Save</button>
        </div>
      )}

    </div>
  )
}