import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoutes from './components/protectedRoutes';

const App = () => {
  return (
    <div className=''>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={
           <Dashboard />
        } />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App 

    // <ProtectedRoutes>
    //         <Dashboard />
    //       </ProtectedRoutes>
