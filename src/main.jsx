import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './style.css' // Import legacy CSS to reuse styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#0275d8' } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
