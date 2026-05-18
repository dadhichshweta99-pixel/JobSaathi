import { Outlet } from 'react-router-dom'
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>
<Outlet/>
      {/* FOOTER */}
      <Footer />

    </div>
  )
}