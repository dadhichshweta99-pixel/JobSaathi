import {  Routes, Route, Navigate } from 'react-router-dom'
import {lazy, Suspense, useEffect, useState} from 'react'
import useAuthStore from './lib/authStore'
import Layout from './ui/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import LoadingScreen from './components/Loader'


const Jobs = lazy(()=> import('./pages/Jobs'))
const AIAssistant = lazy(()=> import('./pages/AiAssistant'))
const Dashboard = lazy(()=> import('./pages/Dashboard'))



const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [loading ,setLoading] = useState(true)

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setLoading(false)
    },2500)
    return()=>clearTimeout(timer)
  },[])
  if(loading){
    return <LoadingScreen/>
  }

  
  return (
    <Suspense fallback={<LoadingScreen/>}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
       
        <Route
          path="jobs"
          element={
          <ProtectedRoute><Jobs/></ProtectedRoute>}
        />
        <Route
          path="AIAssistant"
          element={<ProtectedRoute><AIAssistant /></ProtectedRoute>}
        />
        <Route
          path="Dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
</Suspense>
  )
}
