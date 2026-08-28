import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import './index.css'

function Root() {
  const [auth, setAuth] = React.useState(!!localStorage.getItem('aj_token'))
  if (!auth) return <Login onLogin={() => setAuth(true)} />
  return <App onLogout={() => { localStorage.removeItem('aj_token'); setAuth(false) }} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
