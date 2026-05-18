import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Job from '../models/Job.js'
import User from '../models/User.js'

dotenv.config()

const jobs = [
  { title: 'Frontend Developer', company: 'Google', location: 'Bangalore', type: 'Full-time', salary: '₹18–28 LPA', experience: '2–4 years', skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'Git'], description: 'Build user-facing features for Google products used by billions. Work on cutting-edge web technologies.', applyUrl: 'https://careers.google.com', postedAt: '2 days ago' },
  { title: 'Backend Engineer', company: 'Swiggy', location: 'Hyderabad', type: 'Full-time', salary: '₹15–24 LPA', experience: '2–5 years', skills: ['Node.js', 'Python', 'MongoDB', 'Redis', 'Docker'], description: 'Design and scale backend services handling millions of food delivery orders per day.', applyUrl: '#', postedAt: '1 day ago' },
  { title: 'Data Analyst', company: 'Razorpay', location: 'Pune', type: 'Internship', salary: '₹40K/month', experience: 'Fresher', skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Analysis'], description: 'Analyze payment data, build dashboards, and generate insights for business teams.', applyUrl: '#', postedAt: '3 days ago' },
  { title: 'Product Manager', company: 'Zepto', location: 'Mumbai', type: 'Full-time', salary: '₹22–35 LPA', experience: '3–6 years', skills: ['Product Strategy', 'SQL', 'Figma', 'Data Analysis', 'Agile'], description: 'Own the product roadmap for our quick-commerce checkout experience.', applyUrl: '#', postedAt: '5 days ago' },
  { title: 'UI/UX Designer', company: 'CRED', location: 'Bangalore', type: 'Full-time', salary: '₹12–20 LPA', experience: '2–4 years', skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Adobe XD'], description: 'Design beautiful, intuitive financial experiences for CRED\'s premium user base.', applyUrl: '#', postedAt: '1 week ago' },
  { title: 'Machine Learning Engineer', company: 'PhonePe', location: 'Remote', type: 'Remote', salary: '₹20–30 LPA', experience: '3–5 years', skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'AWS'], description: 'Build ML models for fraud detection and personalization at scale.', applyUrl: '#', postedAt: '4 days ago' },
  { title: 'DevOps Engineer', company: 'Infosys', location: 'Chennai', type: 'Full-time', salary: '₹10–18 LPA', experience: '2–4 years', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'], description: 'Manage cloud infrastructure and deployment pipelines for enterprise clients.', applyUrl: '#', postedAt: '3 days ago' },
  { title: 'React Native Developer', company: 'MakeMyTrip', location: 'Gurgaon', type: 'Full-time', salary: '₹14–22 LPA', experience: '2–4 years', skills: ['React Native', 'JavaScript', 'Redux', 'TypeScript', 'Git'], description: 'Build cross-platform mobile apps for India\'s leading travel platform.', applyUrl: '#', postedAt: '6 days ago' },
  { title: 'Data Science Intern', company: 'Ola', location: 'Bangalore', type: 'Internship', salary: '₹35K/month', experience: 'Fresher', skills: ['Python', 'Machine Learning', 'SQL', 'NumPy', 'Pandas'], description: 'Work on real-world ML problems including route optimization and demand forecasting.', applyUrl: '#', postedAt: '2 days ago' },
  { title: 'Full Stack Developer', company: 'Freshworks', location: 'Chennai', type: 'Full-time', salary: '₹16–26 LPA', experience: '2–5 years', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'], description: 'Build SaaS features for B2B CRM and customer support products.', applyUrl: '#', postedAt: '1 day ago' },
  { title: 'Software Engineer', company: 'Juspay', location: 'Bangalore', type: 'Full-time', salary: '₹15–25 LPA', experience: '1–3 years', skills: ['Haskell', 'Java', 'Python', 'SQL', 'Git'], description: 'Work on India\'s payment infrastructure powering UPI transactions.', applyUrl: '#', postedAt: '2 weeks ago' },
  { title: 'Growth Product Manager', company: 'Meesho', location: 'Bangalore', type: 'Full-time', salary: '₹25–40 LPA', experience: '4–7 years', skills: ['Product Strategy', 'A/B Testing', 'SQL', 'Data Analysis', 'Growth Hacking'], description: 'Drive user acquisition and retention for India\'s leading social commerce platform.', applyUrl: '#', postedAt: '5 days ago' },
  { title: 'Java Backend Engineer', company: 'Paytm', location: 'Noida', type: 'Full-time', salary: '₹12–20 LPA', experience: '2–4 years', skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Microservices'], description: 'Build scalable microservices for Paytm\'s payments and banking products.', applyUrl: '#', postedAt: '3 days ago' },
  { title: 'Graphic Designer', company: 'Nykaa', location: 'Mumbai', type: 'Full-time', salary: '₹6–12 LPA', experience: '1–3 years', skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX'], description: 'Create visual assets for Nykaa\'s app, website, and marketing campaigns.', applyUrl: '#', postedAt: '1 week ago' },
  { title: 'Cloud Solutions Architect', company: 'Wipro', location: 'Hyderabad', type: 'Full-time', salary: '₹25–45 LPA', experience: '7–12 years', skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Docker'], description: 'Architect cloud-native solutions for enterprise transformation programs.', applyUrl: '#', postedAt: '4 days ago' },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing
    await Job.deleteMany({})
     console.log('🗑  Cleared existing jobs')

    // Insert jobs
    await Job.insertMany(jobs)
    console.log(`✅ Inserted ${jobs.length} jobs`)

    // Create demo user
   {/* await User.deleteOne({ email: 'demo@jobverse.com' })
    await User.create({
      name: 'Demo User',
      email: 'demo@jobverse.com',
      password: 'demo1234',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
      location: 'Bangalore',
      onboardingComplete: true,
      preferences: {
        jobTypes: ['Full-time', 'Remote'],
        preferredLocation: 'Bangalore',
        expectedSalary: '10–15 LPA',
        experience: '2–4 years',
      },
    })
    console.log('✅ Demo user created: demo@jobverse.com / demo1234')
*/} 
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seedDB()
