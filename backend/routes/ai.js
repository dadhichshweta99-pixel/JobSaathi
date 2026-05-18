import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { GoogleGenAI } from "@google/genai"
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import User from "../models/User.js"

import { protect } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()



// GeminiAI client
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
// console.log("AI KEY", process.env.GEMINI_API_KEY);

// Multer — file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, //${req.user?._id || "user"}
      `resume-${Date.now()}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Only PDF and DOCX files allowed'))
  },
})

// Utility: extract text from uploaded resume
async function extractResumeText(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.pdf') {
    try {
      const buffer = fs.readFileSync(filePath)
      const pdfParse = (await import('pdf-parse-fork')).default
      const parsed = await pdfParse(buffer)
      return parsed.text
    } catch (err){
   //   console.error("pdf parse error:", err)
      return '[Could not extract PDF text]'
    }
  }
  // For .docx, return a placeholder (full parsing needs mammoth — add if needed)
  
 // console.log("EXTRACTED TEXT:", resumeText)
}



// POST /api/ai/chat
router.post('/chat', protect,
 async (req, res) => {
  try {
  //  console.log("ai key inside", process.env.GEMINI_API_KEY)
  //  console.log("incoming request:", req.body)
    const { message, history = [] } = req.body
    if (!message) return res.status(400).json({ message: 'Message is required' })

    const systemPrompt = `You are an expert AI career coach for JobSaathi, a job-search platform. You help users with:
- Interview preparation and mock interviews
- Resume writing and ATS optimization
- Salary negotiation strategies
- Career transitions and upskilling advice
- Cold outreach and networking tips
- Job search strategies

Use clean markdown headings and bullet points for readability.
Be concise, practical, and encouraging. Use numbered lists or bullet points where helpful. Keep responses under 250 words.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ]
    
const result = await genAI.models.generateContent({
  model: "gemini-3-flash-preview",
  contents:` You are an expert AI Career Coach for JobSaathi.

You help users with:
- Interview preparation
- Career roadmaps
- Salary insights
- Skill gap analysis
- Resume improvement
- Job search guidance

You support multiple domains including:
Software & IT,
Management,
HR,
Marketing,
Finance,
Operations,
Analytics,
and Creative careers.


Use clean markdown headings and bullet points for readability.
Give structured, practical, concise guidance in markdown format.
        User Request:
        ${message}`,
})

const text = result.text
console.log(text);

res.json({ reply: text })
  } catch (err) {
  //  console.error('AI Chat error:', err.message)
    res.status(500).json({ message: 'AI service unavailable. Please try again.' })
  }
})

// POST /api/ai/resume-analyze
router.post('/resume-analyze', protect,
 upload.single('resume'), async (req, res) => {
  try {
    const { mode } = req.body // 'demand' or 'style'
    if (!req.file) return res.status(400).json({ message: 'Resume file is required' })

    const resumeText = await extractResumeText(req.file.path)
    console.log("Resume Text length:", resumeText.length)
    console.log("resume preview:", resumeText.slice(0,500))

    // Clean up uploaded file
    fs.unlinkSync(req.file.path)

    if (mode === 'style') {
      // ATS & Style Analysis
      const prompt = `Analyze this resume for ATS compatibility and style. Return ONLY valid JSON in this exact format:
{
  "atsScore": <number 0-100>,
  "resumeSummary": "<short professional summary>" ,
  "resumeSuggestions": [<string>, <string>, <string>, <string>, <string>],
  "futureSkills": [
  { "title": "<skill name>", 
   "description" : "<1-2 line career benefit>"
  }]
}

Where:
- atsScore: ATS compatibility score (0-100)
- resumeSummary: 2-3 line professional summary of the candidate profile
- resumeSuggestions: 5 concrete resume improvement tips
- futureSkills: 4 important skills or technologies the candidate should learn next with
                a short explanation of how each skill improves career opportunities

Resume text:
${resumeText.slice(0, 3000)}`

      const resultt = await genAI.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: prompt,
})

const raw = resultt.text
const cleaned = raw.replace(/```json|```/g, '').trim()
    
let result
try {
  result = JSON.parse(cleaned)
  if (req.user) {
  const user = await User.findById(req.user._id)

  if (user) {
    user.matchScore = result.atsScore || 0
    await user.save()
  }
}
} catch (err) {
//  console.error("ATS JSON parse failed:", err)
  
  result = {
  atsScore: 45,
  resumeSummary : "Frontend developer with MERN stack knowledge and growing backend experience .",
  resumeSuggestions: [
    "Unable to fully analyze resume",
    "Try simpler formatting",
    "Add more technical skills",
  ],
  futureSkills: [{
    title:"React", 
  description : "react is highly demanded for modern frontend and MERN stack development roles."},
{
  title: "Node.js",
  description:"node.js helps build scalable backend applications and improves full-stack opportunities."
},],
  raw: raw,
}
}
res.json(result)
 } else {
      // Market Demand Analysis
      const prompt = `Analyze this resume for job market demand. Return ONLY valid JSON in this exact format:
{
  "atsScore": <number 0-100>,
  "roles": [
    {"title": "<role>", "demand": "<High|Medium|Growing>"},
    {"title": "<role>", "demand": "<High|Medium|Growing>"},
    {"title": "<role>", "demand": "<High|Medium|Growing>"}
  ],
  "skillGaps": [<string>, <string>, <string>, <string>]
}

Where:
- atsscore: overall market demand score for this candidate
- roles: 3 best matching job roles based on their skills
- skillGaps: 4 in-demand skills they should add

Resume text:
${resumeText.slice(0, 3000)}`

     const result = await genAI.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: prompt,
})
const raw = result.text
     
      const cleaned = raw.replace(/```json|```/g, '').trim()
      //const rResult = JSON.parse(cleaned)
      let rResult

try {
  const cleaned = raw.replace(/```json|```/g, '').trim()
  rResult = JSON.parse(cleaned)
} catch (err) {
 // console.error("JSON parse failed:", err)

  // fallback so server DOES NOT crash
  rResult = {
    atsScore: 50,
    resumesuggestions: ["Improve formatting", "Add more skills"],
    futureSkills: ["React", "Node"],
    raw: raw,
  }
}
      res.json(rResult)
    }

  } catch (err) {
   // console.error('Resume analysis error:', err.message)
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ message: 'Resume analysis failed. Please try again.' })
  }
})

export default router
