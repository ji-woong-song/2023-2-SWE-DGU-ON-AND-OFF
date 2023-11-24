import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminHome from './components/pages/admin/home/AdminHome';
import AdminLogin from './components/pages/admin/login/AdminLogin';
import AdminSignup from './components/pages/admin/signup/AdminSignup';
import MainPage from './components/pages/service/home/MainPage';
import useModalCreater from './modules/modal/Modal';


function App() {
  // Hook
  useModalCreater();


  // Render
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
