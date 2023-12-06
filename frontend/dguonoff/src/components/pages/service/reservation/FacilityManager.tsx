import React, { useEffect, useState } from "react";
import styles from "./FacilityManager.module.css";
import SelectBuildingFloor from "./commons/SelectFacilityFloor";
import FloorFacilityTable from "./commons/FloorFacilityTable";
import Facility from "../../../../types/Facility";
import { getAuthToken, getFacilities, getUserRole } from "../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";
import FacilityDetails from "./commons/FacilityDetails";
import { SelectedBuildingContext, SelectedFacilityContext } from "../../../../App";


export type ReservationMode = "예약" | "On/Off";



export default function FacilityManager() {
  // Const 
  const navigate = useNavigate();


  // State
  const [reservationMode, setReservationMode] = useState<ReservationMode>("예약");
  const [floor, setFloor] = useState<number>(-1);
  const [facilities, setFacilities] = useState<Facility[]>([]);


  // Context
  const selectedBuilding = React.useContext(SelectedBuildingContext).selectedBuilding;
  const { selectedFacility, setSelectedFacility } = React.useContext(SelectedFacilityContext);


  // Effect
  /*useEffect(() => {
    setSelectedBuilding(new Building("신공학관(기숙사)", 10));
  }, []);*/

  useEffect(() => {
    if (selectedBuilding) {
      (async () => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
          let newFacilities: Facility[] = await getFacilities(token, floor, selectedBuilding.getName());
          setFacilities(newFacilities);
        } else {
          alert("로그인 시간이 만료되었습니다.");
          navigate("/login")
        }
      })();
    }
  }, [navigate, floor, selectedBuilding]);


  // Render
  return (
    <div className={styles.FacilityManager}>
      <div className={styles.top}>
        <div className={styles.select_mode}>
          <div onClick={() => { setReservationMode("예약") }} style={{ borderBottom: `5px solid ${reservationMode === "예약" ? "var(--component-main-color)" : "white"}` }}>예약</div>
          <div onClick={() => { setReservationMode("On/Off") }} style={{ borderBottom: `5px solid ${reservationMode === "On/Off" ? "var(--component-main-color)" : "white"}` }}>On/Off</div>
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.middle_left}>
          <SelectBuildingFloor
            maxFloor={10}
            floor={floor}
            setFloor={setFloor}
          />
        </div>
        <div className={styles.middle_right}>
          {selectedBuilding && <FloorFacilityTable
            reservationMode={reservationMode}
            floor={floor}
            building={selectedBuilding}
            facilities={facilities}
            setFacilities={setFacilities}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
          />}
        </div>
      </div>

      <div className={styles.bottom}>
        {selectedBuilding &&
          <FacilityDetails
            reservationMode={reservationMode}
            building={selectedBuilding}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
          />}
      </div>
    </div >
  );
};