import { useEffect, useState } from "react";
import styles from "./FixedTimetableManager.module.css";
import Building from "../../../../types/Building";
import Facility from "../../../../types/Facility";
import { Day } from "../../../../types/Day";
import FacilityTable from "./commons/FacilityTable";
import FacilityTimetable from "./commons/FacilityTimetable";
import FacilityEventInfo from "./commons/FacilityEventInfo";
import FacilityCategoryTable, { FacilityCategory } from "./commons/FacilityCategoryTable";


/** 고정 시간표 관리 */
export default function FixedTimetableManager() {
    // State
    const [currFacility, setCurrFacility] = useState<FacilityCategory>("Blank");
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
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
        <div className={styles.fixedTimetableManager}>
            <div className={styles.top_contents}>
                <FacilityCategoryTable
                    currFacility={currFacility}
                    setCurrFacility={setCurrFacility}
                />
            </div>
            <div className={styles.mid_contents}>
                <div className={styles.search_filter}>
                    <div className={styles.period}>
                        <label htmlFor="start-date">적용 기간</label>
                        <input
                            type="date"
                            id="start-date"
                            name="start-date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => { setStartDate(new Date(e.target.value)); }}
                        />

                        <span>~</span>

                        <input
                            type="date"
                            id="end-date"
                            name="end-date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => { setEndDate(new Date(e.target.value)); }}
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
                        <button className={styles.register}>고정 시간표 등록</button>
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
                            submitType={"register"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}