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
import React, { createContext, useState } from 'react';
import Reservation from './types/Reservation';
import AnnouncementPage from './components/pages/service/information/Announcement';
import FacilityManager from './components/pages/service/reservation/FacilityManager';
import ReservationManager from './components/pages/service/reservation/ReservationManager';
import Facility from './types/Facility';
import Building from './types/Building';
// import UserInfo from './components/pages/service/information/UserInfo';
// import ReservationDetailPage from './components/pages/service/reservation/ReservationDetailPage';

export const ReservationContext = React.createContext({
  reservationInfo: new Reservation(), // 기본값
  setReservationInfo: (resrvation: Reservation) => { }, // 빈 함수로 초기화
});


export const SelectedBuildingContext = React.createContext<{
  selectedBuilding: Building | null;
  setSelectedBuilding: React.Dispatch<React.SetStateAction<Building | null>>;
}>({ selectedBuilding: null, setSelectedBuilding: () => { } });


export const SelectedFacilityContext = React.createContext<{
  selectedFacility: Facility | null;
  setSelectedFacility: React.Dispatch<React.SetStateAction<Facility | null>>;
}>({ selectedFacility: null, setSelectedFacility: () => { } });



function App() {
  const [reservationInfo, setReservation] = useState<Reservation>(new Reservation());
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const setReservationInfo = (reservation: Reservation): void => {
    setReservation(reservation);
  };
  // Hook
  useModalCreater();


  // Render
  return (
    <div className="App">
      <ReservationContext.Provider value={{ reservationInfo, setReservationInfo }}>
        <SelectedBuildingContext.Provider value={{ selectedBuilding, setSelectedBuilding }}>
          <SelectedFacilityContext.Provider value={{ selectedFacility, setSelectedFacility }}>

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/reservationInfo" element={<ReservationInfo reservation={reservationInfo!} />} />
                <Route path="/announcement" element={<AnnouncementPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                {/* <Route path="/userInfo" element={<UserInfo/>} />
            <Route path="/reservationPage" element={<ReservationPage />} />
            <Route path="/onoffPage" element={<OnOffPage />} />
            <Route path="/reservationdetailPage" element={<ReservationDetailPage />}/> */}
                <Route path="/facility" element={<FacilityManager />} />
                <Route path="/reservation" element={<ReservationManager />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
              </Routes>
            </BrowserRouter>
          </SelectedFacilityContext.Provider>
        </SelectedBuildingContext.Provider>
      </ReservationContext.Provider>
    </div>
  );
}

export default App;
