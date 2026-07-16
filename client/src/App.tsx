import { LogIn } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
const App = () => {
  return (
    <>
      <Toaster position='top-right' toastOptions={{
        duration: 3000, style: {
          background: "#1B3022", color: "#fff", borderRadius: "12px", fontSize: "14px"
        }
      }} />




      <Routes>

        <Route path='/login' element={<Login />} />





      </Routes>











    </>



  )
}

export default App