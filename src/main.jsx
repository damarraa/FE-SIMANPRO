import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './MainLayout/MainLayout'
import { AuthProvider } from './Contexts/AuthContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  </StrictMode>,
)
