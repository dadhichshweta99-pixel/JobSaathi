import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import Signup from '../pages/Signup'
import Login from '../pages/Login'



const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem("token",res.data.token)
        const { token, user } = res.data
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token, isLoading: false })
        return user
      },
      demoLogin: () => {
  const user = {
    name: "Demo User",
    email: "demo@jobsaathi.com",
  }

  //set({ user, token: "demo-token" })
  // temporary fix
  localStorage.removeItem("token")
  set({user, token:null})
},

      signup: async (data) => {
        set({ isLoading: true })
        const res = await api.post('/auth/register', data)
        const { token, user } = res.data
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token, isLoading: false })
        return user
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null })
      },

      updateProfile: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'jobSaathi-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)

export default useAuthStore
