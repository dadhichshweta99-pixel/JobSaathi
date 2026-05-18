import { useState, useEffect } from "react"
import { Search, MapPin ,  BookMarked } from "lucide-react"
import toast from "react-hot-toast"
import { useRef } from "react"
import api from "../lib/api"
import useAuthStore from "../lib/authStore"





/* ===== JOB CARD ===== */
function JobCard({ job, onSave }) {
  return (
    <div className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">
            {job.job_title || job.title}
          </h3>

          <p className="text-sm text-slate-500">
            {job.employer_name || job.company}
          </p>

          <p className="text-sm text-slate-500">
            {job.job_location || job.location}
          </p>
        </div>

        <button
          onClick={() => onSave(job)}
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <BookMarked size={18} />
        </button>
      </div>
    </div>
  )
}

/* ===== MAIN ===== */
export default function JobBoard() {
  const suggestionRef = useRef()
  const [filteredJobs, setFilteredJobs] = useState([])
  
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const debounceRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((s) => s.user)
  const[hasSearched, setHasSearched] = useState(false)
  

  /* ===== SEARCH FUNCTION ===== */
  const handleSearch = () => {
    fetchJobs()
  }


useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      suggestionRef.current &&
      !suggestionRef.current.contains(event.target)
    ) {
      setSuggestions([])
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    )
  }
}, [])

/* fetch jobs */
const fetchJobs = async () => {
  setLoading(true)
  setHasSearched(true)
  try{
 const res = await fetch(
  `${import.meta.env.VITE_API_URL}/jobs/search?query=${query}&location=${location}`
)
  const data = await res.json()
  // console.log("Fetched jobs:" , data)
  setFilteredJobs(Array.isArray(data)? data : [])
}
catch(error){
 // console.log("Fetch jobs error:",error)
  toast.error("Failed to fetch")
}finally{
  setLoading(false)
  }}

 /* auto suggest(Job Title) */
 const handleSuggestion = /*async */ (value) => {
  setQuery(value)

  clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(async () => {
    if (!value.trim()){
      setSuggestions([])
      return
    }
    try{
      const res = await fetch(
    `${import.meta.ent.VITE_API_URL}jobs/suggest?keyword=${value}`)
      const data = await res.json ()
      setSuggestions(Array.isArray(data) ? data: [])
    } catch(error){
      // console.error("Suggestion error:",error)
      setSuggestions([])
    } 
  },500)
  
}
// save function 
  const saveJob = async (job) => {
  if (!user) {
    toast.error("Login required")
    return
  }

  try {
    await api.post("/users/save-job", {
      title: job.job_title || job.title,
      company: job.employer_name || job.company,
      location: job.job_location || job.location,
      jobId: job.job_id || job._id,
    })

    toast.success("Job added to your dashboard")
  } catch (error) {
   // console.log(error)
    toast.error("Could not save job")
  }
}


  return (
    <div className="page-container min-h-screen py-6 pt-20 sm:pt-24">

      <h1 className="text-2xl sm:text-3xl font-bold mb-5">
        Discover Your Next Opportunity
      </h1>

      {/* ===== SEARCH BAR ===== */}
    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-white p-3 sm:p-4 rounded-2xl border shadow-sm mb-6">

        {/* TITLE */}
        <div ref={suggestionRef} className=" relative flex items-center gap-2 flex-1 min-w-0">
          <Search size={16} />
          <input
            value={query}
            placeholder="Job title..."
            className="flex-1 min-w-0 outline-none bg-transparent text-sm"
            onChange={(e) =>
              handleSuggestion( e.target.value )
            }
            onKeyDown={(e)=>{
              if(e.key === "Enter"){
                fetchJobs()
                setSuggestions([])
              }
            }}
          />
          {suggestions.length > 0 && (
  <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
    {suggestions.map((s, i) => (
      <li
        key={i}
        className="p-2 hover:bg-slate-100 cursor-pointer text-sm"
        onClick={() => {
          setQuery(s)
          setSuggestions([])
        }}
      >
        {s}
      </li>
    ))}
  </ul>
)}
        </div>

        {/* LOCATION */}
        <div className=" relative flex items-center gap-2 flex-1 min-w-0">
          <MapPin size={16} />
          <input
            value={location}
            placeholder="Location..."
            className="flex-1 min-w-0 outline-none text-sm"
            onChange={(e) =>
              setLocation( e.target.value )
            }
          />
         
        </div>

        {/* BUTTON */}
        <button  
        disabled={loading}
        className={`btn-primary py-2.5 w-full sm:w-auto ${loading ?
           "opacity-70 cursor-not-allowed" : ""}`}
        onClick={()=>
          {fetchJobs()
            setSuggestions([])
          }} 
          >
        
          {loading ? "Searching..":"Search"}
        </button>
      </div>

      {/* ===== JOB LIST ===== */}
      {/* ===== JOB LIST ===== */}
<div className="space-y-4">

  {filteredJobs.length === 0 ? (
    hasSearched ? (
      <p className="text-slate-500 text-center py-10">
        No matching jobs found. Try another title or location.
      </p>
    ) : (
      <div className="text-center py-16">
        <p className="text-slate-500">
          Search jobs by title or location 🚀
        </p>
      </div>
    )
  ) : (
    filteredJobs.map((job, index) => (
      <JobCard
        key={job._id || job.job_id || index}
        job={job}
        onSave={saveJob}
      />
    ))
  )}

</div>
    </div>
  )
}