import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'react-hot-toast'

import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />

    {/* Toaster global: notificaciones visuales para todo el app */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--color-surface-1)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-text)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--color-text)',
          },
        },
      }}
    />
  </StrictMode>
)
