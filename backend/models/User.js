import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // Profile
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },

    // Job preferences
    preferences: {
      jobTypes: [String],
      preferredLocation: String,
      expectedSalary: String,
      experience: String,
    },

    skills: [String],
    onboardingComplete: { type: Boolean, default: false },

    // Saved & applied jobs
    savedJobs: [
  {
    title: String,
    company: String,
    location: String,
    jobId: String,
    
  },
], matchScore:{
  type: Number,
  default : 0,
},

  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return 
  this.password = await bcrypt.hash(this.password, 12)
  
})

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
