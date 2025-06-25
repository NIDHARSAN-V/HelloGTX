import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import store from './Store/store.js'
import { Provider } from 'react-redux'
import { Toaster } from './Components/ui/sonner.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <Toaster/>
    <App />
   
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
