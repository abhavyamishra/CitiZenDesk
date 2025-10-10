import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

import { AppRouter } from './routes/AppRoutes'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
    
      <Provider store={store}>
        <AppRouter />
      </Provider>    
  
    </ BrowserRouter>
    
    
  </StrictMode>,
)
