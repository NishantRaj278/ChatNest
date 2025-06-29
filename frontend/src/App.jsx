import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './views/Homepage'
import LoginPage from './views/LoginPage'
import SignUpPage from './views/SignUpPage'
import ProfilePage from './views/ProfilePage'
import SettingsPage from './views/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])


  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <Homepage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
      
      <Toaster />
    </div>
  )
}

export default App