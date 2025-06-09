import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import CommonComponents from './layouts/CommonComponents';

import './App.css';
import Exchange from './pages/Exchange';
import User from './pages/Login';
import Investment from './feature/investment/Investment';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route element={<CommonComponents />}>
          <Route path='/' element={<Home />} />
          <Route path='/exchange' element={<Exchange />} />
          <Route path='/login' element={<User />} />
          <Route path='/investments' element={<Investment />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
