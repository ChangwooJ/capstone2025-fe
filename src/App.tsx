import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CommonComponents from './layouts/CommonComponents';

import './App.css';
import Exchange from './pages/Exchange';
import User from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<CommonComponents />}>
          <Route path='/' element={<Home />} />
          <Route path='/exchange' element={<Exchange />} />
          <Route path='/login' element={<User />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
