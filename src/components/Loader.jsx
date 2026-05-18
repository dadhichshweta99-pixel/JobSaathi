import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">

      <motion.img
        src="/loadscreen.png"
        alt="JobSaathi"
        className="w-24 h-24 object-contain"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      />

      <motion.h1
        className="mt-5 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        JobSaathi
      </motion.h1>

      <p className="text-slate-400 text-sm mt-2">
        Finding opportunities for you...
      </p>
    </div>
  )
}