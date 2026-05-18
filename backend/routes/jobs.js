import express from 'express'
import { protect } from '../middleware/auth.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import axios from 'axios'

const router = express.Router()

// Frequency Counter — DSA-based match scoring
function computeMatchScore(jobSkills = [], userSkills = []) {
  if (!userSkills.length || !jobSkills.length) return Math.floor(Math.random() * 30) + 40

  // Build frequency map of user skills (lowercase)
  const userSkillMap = {}
  userSkills.forEach((s) => { userSkillMap[s.toLowerCase()] = true })

  let matches = 0
  jobSkills.forEach((s) => {
    if (userSkillMap[s.toLowerCase()]) matches++
  })

  const score = Math.round((matches / jobSkills.length) * 100)
  // Clamp between 20–98
  return Math.min(98, Math.max(20, score + Math.floor(Math.random() * 10)))
}

// GET /api/jobs
router.get('/', protect, async (req, res) => {
  try {
    const { title, location, type, experience, page = 1, limit = 10 } = req.query

    const query = { isActive: true }

    if (title) {
      query.$or = [
        { title: { $regex: title, $options: 'i' } },
        { description: { $regex: title, $options: 'i' } },
        { skills: { $regex: title, $options: 'i' } },
      ]
    }
    if (location) query.location = { $regex: location, $options: 'i' }
    if (type && type !== 'Any') query.type = type
    if (experience && experience !== 'Any') query.experience = { $regex: experience, $options: 'i' }

    const total = await Job.countDocuments(query)
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    // Attach match score and saved status
    const user = await User.findById(req.user._id)
    const savedSet = new Set(user.savedJobs.map((id) => id.toString()))

    const jobsWithScore = jobs.map((job) => ({
      ...job.toObject(),
      matchScore: computeMatchScore(job.skills, user.skills),
      saved: savedSet.has(job._id.toString()),
    }))

    // Sort by match score descending
    jobsWithScore.sort((a, b) => b.matchScore - a.matchScore)

    res.json({ jobs: jobsWithScore, total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




//Jsearch , search
router.get("/search", async (req, res) => {
  const { query, location } = req.query
 // console.log("Search API hit")
// console.log("Query:", query)
// console.log("Location:", location)

  try {
    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: `${query} in ${location}`,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );
// console.log("Jobs fetched:", response.data.data.length)
    res.json(response.data.data)
  } catch (error) {
   // console.error(error.message)
    res.status(500).json({ error: "API error" })
  }
})

// suggestion in search
router.get("/suggest", async (req, res) => {
  const { keyword } = req.query;

  try {
    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: keyword,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    const suggestions = response.data.data.map(
      (job) => job.job_title
    );

    res.json([...new Set(suggestions)].slice(0, 5))
  } catch (err) {
    res.status(500).json({ error: "Suggestion error" })
  }
})



// GET /api/jobs/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/jobs/:id/save  (toggle)
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const jobId = req.params.id
    const idx = user.savedJobs.findIndex((id) => id.toString() === jobId)

    if (idx === -1) {
      user.savedJobs.push(jobId)
    } else {
      user.savedJobs.splice(idx, 1)
    }

    await user.save()
    res.json({ saved: idx === -1, message: idx === -1 ? 'Job saved' : 'Job unsaved' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/jobs/:id/apply
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const jobId = req.params.id

    const alreadyApplied = user.appliedJobs.find((a) => a.job.toString() === jobId)
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied to this job' })

    user.appliedJobs.push({ job: jobId })
    await user.save()

    res.json({ message: 'Application recorded!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




export default router
