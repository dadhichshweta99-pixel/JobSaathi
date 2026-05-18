import axios from 'axios'

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default api
