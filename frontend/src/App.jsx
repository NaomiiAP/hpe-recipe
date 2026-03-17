import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    // Basic health check to see if backend is connected
    axios.get('/api/health')
      .then(res => setHealthStatus(res.data.status))
      .catch(err => setHealthStatus('Disconnected'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>HPE Recipe Detection Tool</h1>
      <p>Backend Status: <strong>{healthStatus}</strong></p>
      
      <p>
        The backend API is designed to run on <code>http://localhost:8080</code> 
        and the React development server is proxying requests to it.
      </p>

      <div>
        <h3>Implementation Plan:</h3>
        <ul>
          <li>Create <code>CatalogSelector.jsx</code></li>
          <li>Create <code>RecipeList.jsx</code></li>
          <li>Integrate <code>reactflow</code> for upgrade paths visualization</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
