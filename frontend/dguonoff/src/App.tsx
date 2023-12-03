import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminHome from './components/pages/admin/home/AdminHome';
import AdminLogin from './components/pages/admin/login/AdminLogin';
import AdminSignup from './components/pages/admin/signup/AdminSignup';
import MainPage from './components/pages/service/home/MainPage';
import useModalCreater from './modules/modal/Modal';
import ReservationInfo from './components/pages/service/information/ReservationInfo';
import LoginPage from './components/pages/service/login/LoginPage';
import SignupPage from './components/pages/service/signup/SignupPage';
import UserInfo from './components/pages/service/information/UserInfo';
import ReservationDetailPage from './components/pages/service/reservation/ReservationDetailPage';

function App() {
  // Hook
  useModalCreater();


  // Render
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reservationInfo" element={<ReservationInfo/>} />
          <Route path="/userInfo" element={<UserInfo/>} />
          <Route path="/reservationPage" element={<ReservationPage />} />
          <Route path="/onoffPage" element={<OnOffPage />} />
          <Route path="/reservationdetailPage" element={<ReservationDetailPage />}/>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
