import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Make sure this matches your App.tsx filename

// This finds the root div in your index.html
const rootElement = document.getElementById('root')

// Type assertion that the element exists
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('Failed to find the root element')
}