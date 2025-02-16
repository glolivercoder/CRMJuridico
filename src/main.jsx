import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './Header.jsx'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Documentos from './pages/Documentos'
import { DashboardLayout } from './components/layout/DashboardLayout'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/clientes" element={<DashboardLayout><Clientes /></DashboardLayout>} />
        <Route path="/documentos" element={<DashboardLayout><Documentos /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
