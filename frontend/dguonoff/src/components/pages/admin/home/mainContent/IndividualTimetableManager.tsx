import { useEffect, useState } from "react";
import styles from "./IndividualTimetableManager.module.css";
import FacilityTable from "./commons/FacilityTable";
import FacilityTimetable from "./commons/FacilityTimetable";
import FacilityEventInfo, { FacilityEvent } from "./commons/FacilityEventInfo";
import FacilityCategoryTable, { FacilityCategory } from "./commons/FacilityCategoryTable";
import Facility from "../../../../../types/Facility";
import Building from "../../../../../types/Building";
import { Day } from "../../../../../types/Day";


/** 개별 시간표 관리 */
export default function IndividualTimetableManager() {
    // State
    const [currFacility, setCurrFacility] = useState<FacilityCategory>("강의실");
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(new Building());
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

    const [currDay, setCurrDay] = useState<Day>("MONDAY");
    const [date, setDate] = useState<Date>(new Date());
    const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
    const [facilityEvent, setFacilityEvent] = useState<FacilityEvent>({ name: '', hostName: '', outline: '', purpose: '', guestNumber: 0 });
    const [doSubmitEvent, setDoSubmitEvent] = useState<boolean>(false);
    const [doRemoveEvent, setDoRemoveEvent] = useState<boolean>(false);


    // Effect
    useEffect(() => {
        /*  setBuildings([new Building("신공학관", [new Facility("3144")])]);
          setFacilities(Array.from({ length: 50 }, (_, index) => {
              return new Facility(`신공학관 ${3105 + index}`, Math.floor(Math.random() * 100));
          }));*/
    }, []);


    // Redner
    return (
        <div className={styles.individualTimetableManager}>
            <div className={styles.top_contents}>
                <FacilityCategoryTable
                    currFacility={currFacility}
                    setCurrFacility={setCurrFacility}
                />
            </div>
            <div className={styles.mid_contents}>
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
                            selectedFacility={selectedFacility}
                            setSelectedFacility={setSelectedFacility}
                        />
                    </div>
                    <div className={styles.facility_timetable}>
                        <FacilityTimetable
                            currDay={currDay}
                            setCurrDay={setCurrDay}
                            selectedTimes={selectedTimes}
                            setSelectedTimes={setSelectedTimes}
                        />
                    </div>
                    <div className={styles.event_info}>
                        <FacilityEventInfo
                            submitType={"modify"}
                            facilityEvent={facilityEvent}
                            setFacilityEvent={setFacilityEvent}
                            setDoSubmitEvent={setDoSubmitEvent}
                            setDoRemoveEvent={setDoRemoveEvent}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}