import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'
import Job from '../models/Job.js'

const router = express.Router()

// GET /api/users/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user)
})

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'location', 'bio', 'skills', 'preferences', 'onboardingComplete']
    const updates = {}
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({
      saved: user.savedJobs.length,
    
    //  views: user.profileViews,
    //  avgMatch: user.skills.length > 0 ? Math.min(95, 50 + user.skills.length * 3) : 0,
    avgMatch: user.matchScore || 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/saved-jobs
router.get('/saved-jobs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ jobs: user.savedJobs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/save-job', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    user.savedJobs.push(req.body)

    await user.save()

    res.json({
      success: true,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})
// DELETE /api/users/Remove-saved-jobs/:id
router.delete('/remove-saved-job/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    user.savedJobs = user.savedJobs.filter(
      (job) => job._id.toString() !== req.params.id
    )

    await user.save()

    res.json({
      success: true,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})
// GET /api/users/applied-jobs
/*router.get('/applied-jobs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('appliedJobs.job')
    const jobs = user.appliedJobs.map((a) => ({
      ...a.job.toObject(),
      appliedAt: a.appliedAt,
      status: a.status,
    }))
    res.json({ jobs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}) */

export default router
