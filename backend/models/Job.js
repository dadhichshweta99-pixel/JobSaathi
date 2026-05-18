import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Remote'],
      default: 'Full-time',
    },
    description: { type: String, default: '' },
    skills: [String],
    salary: { type: String, default: '' },
    experience: { type: String, default: '' },
    applyUrl: { type: String, default: '' , trim:true},
    source: { type: String, default: 'JobVerse' },
    postedAt: { type: String, default: 'Posted recently' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' })

export default mongoose.model('Job', jobSchema)
