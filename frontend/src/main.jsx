import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

//Cấu hình Redux-Persit
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import App from './App.jsx'
import CustomThemeProvider from './components/ThemeProvider'
import { store } from '~/redux/store'

// Import global theme styles
import './assets/global-theme.css'
import './assets/text-selection.css'

// Cấu hình Redux-Persit
const persistor = persistStore(store)

// Kỹ thuật Inject Store
import { injectStore } from '~/utils/authorizedAxios'

injectStore(store)

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CustomThemeProvider>
          <App />
          <ToastContainer theme='colored' />
        </CustomThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
