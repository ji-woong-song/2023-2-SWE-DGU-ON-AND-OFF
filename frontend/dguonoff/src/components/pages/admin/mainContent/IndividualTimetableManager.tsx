import { useEffect, useState } from "react";
import styles from "./IndividualTimetableManager.module.css";
import Building from "../../../../types/Building";
import Facility from "../../../../types/Facility";
import { Day } from "../../../../types/Day";
import FacilityTable from "./commons/FacilityTable";
import FacilityTimetable from "./commons/FacilityTimetable";
import FacilityEventInfo from "./commons/FacilityEventInfo";


/** 개별 시간표 관리 */
export default function IndividualTimetableManager() {
    // State
    const [date, setDate] = useState<Date>(new Date());
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(new Building());
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [currDay, setCurrDay] = useState<Day>("월");


    // Effect
    useEffect(() => {
        setBuildings([new Building("신공학관", [new Facility("3144")])]);
        setFacilities(Array.from({ length: 50 }, (_, index) => {
            return new Facility(`신공학관 ${3105 + index}`, Math.floor(Math.random() * 100));
        }));
    }, []);


    // Redner
    return (
        <div className={styles.individualTimetableManager}>
            <div className={styles.search_filter}>
                <div className={styles.period}>
                    <label htmlFor="date">선택 날짜</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={date.toISOString().split('T')[0]}
                        onChange={(e) => { setDate(new Date(e.target.value)); }}
                    />
                </div>

                <div className={styles.building}>
                    <label htmlFor="building-select">건물 코드</label>
                    <select
                        id="building-select"
                        onChange={(e) => setSelectedBuilding(buildings[e.target.selectedIndex])}
                    >
                        {buildings.map((building, index) => (
                            <option key={index} value={building.getName()}>
                                {building.getName()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.search}>조회</button>
                </div>
            </div>

            <div className={styles.facility_manager}>
                <div className={styles.facility_table}>
                    <FacilityTable
                        facilities={facilities}
                    />
                </div>
                <div className={styles.facility_timetable}>
                    <FacilityTimetable
                        currDay={currDay}
                        setCurrDay={setCurrDay}
                    />
                </div>
                <div className={styles.event_info}>
                    <FacilityEventInfo
                        submitType={"modify"}
                    />
                </div>
            </div>
        </div>
    )
}