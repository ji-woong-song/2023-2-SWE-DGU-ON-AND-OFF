import { useEffect, useState } from "react";
import styles from "./FacilityManager.module.css";


type PageMode = "예약" | "On/Off";


export default function FacilityManager() {
  // State
  const [mode, setMode] = useState<PageMode>("예약");



  return (
    <div className={styles.FacilityManager}>
      <div className={styles.top}>
        <div className={styles.select_mode}>
          <div onClick={() => { setMode("예약") }} style={{ borderBottom: `5px solid ${mode === "예약" ? "var(--component-main-color)" : "white"}` }}>예약</div>
          <div onClick={() => { setMode("On/Off") }} style={{ borderBottom: `5px solid ${mode === "On/Off" ? "var(--component-main-color)" : "white"}` }}>On/Off</div>
        </div>
      </div>

      <div className={styles.middle}>
      </div>

      <div className={styles.bottom}>
      </div>
    </div >
  );
};