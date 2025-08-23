import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...')
  const [version, setVersion] = useState('')

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setApiStatus(data.message))
      .catch(error => setApiStatus('API Error: ' + error.message))

    // Get version
    fetch('/api/version')
      .then(response => response.json())
      .then(data => setVersion(data.version))
      .catch(error => setVersion('Version unavailable'))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Noxtm Studio</h1>
        <p>Full-Stack Application Successfully Deployed!</p>
        
        <div className="status-cards">
          <div className="status-card">
            <h3>API Status</h3>
            <p>{apiStatus}</p>
          </div>
          
          <div className="status-card">
            <h3>Version</h3>
            <p>{version}</p>
          </div>
          
          <div className="status-card">
            <h3>Frontend</h3>
            <p>React + Vite</p>
          </div>
          
          <div className="status-card">
            <h3>Backend</h3>
            <p>Node.js + Express</p>
          </div>
          
          <div className="status-card">
            <h3>Database</h3>
            <p>MongoDB</p>
          </div>
          
          <div className="status-card">
            <h3>Server</h3>
            <p>Contabo VPS</p>
          </div>
        </div>

        <div className="deployment-info">
          <h3>🎯 Deployment Complete!</h3>
          <p>Your full-stack app is now running on your Contabo VPS</p>
          <p>IP: 185.137.122.61</p>
        </div>
      </header>
    </div>
  )
}

export default App 