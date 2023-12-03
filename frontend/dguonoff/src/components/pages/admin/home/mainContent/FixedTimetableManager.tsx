import { useEffect, useState } from "react";
import styles from "./FixedTimetableManager.module.css";
import FacilityTable from "./commons/FacilityTable";
import FacilityTimetable from "./commons/FacilityTimetable";
import FacilityEventInfo, { FacilityEvent } from "./commons/FacilityEventInfo";
import FacilityCategoryTable, { FacilityCategory } from "./commons/FacilityCategoryTable";
import Building from "../../../../../types/Building";
import Facility from "../../../../../types/Facility";
import { Day } from "../../../../../types/Day";
import { getAuthToken, getFacilities, getFixedSchedules, getUserRole, registerFixedSchedules } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";


interface FixedTimetableManagerParams {
    buildings: Building[];
}



/** 고정 시간표 관리 */
export default function FixedTimetableManager({ buildings }: FixedTimetableManagerParams) {
    // Const
    const navigate = useNavigate();


    // State
    const [currFacility, setCurrFacility] = useState<FacilityCategory>("강의실");
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);


    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [currDay, setCurrDay] = useState<Day>("MONDAY");
    const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
    const [facilityEvent, setFacilityEvent] = useState<FacilityEvent>({ name: '', hostName: '', outline: '', purpose: '', guestNumber: 0 });
    const [doSubmitEvent, setDoSubmitEvent] = useState<boolean>(false);
    const [doRemoveEvent, setDoRemoveEvent] = useState<boolean>(false);


    // Effect
    useEffect(() => {
        if (buildings.length > 0) {
            setSelectedBuilding(buildings[0]);
        }
    }, [buildings]);

    useEffect(() => {
        if (selectedBuilding) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole) {
                    let newFacilities: Facility[] = [];
                    for (let i = 1; i <= selectedBuilding.getMaxFloor(); i++) {
                        newFacilities = [...newFacilities, ...(await getFacilities(token, i, selectedBuilding.getName()))];
                    }
                    setFacilities(newFacilities);
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [selectedBuilding]);

    useEffect(() => {
        if (selectedFacility && selectedBuilding) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole) {
                    getFixedSchedules(token, currDay, startDate, endDate, selectedFacility, selectedBuilding);
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [selectedFacility, selectedBuilding, currDay]);

    useEffect(() => {
        if (selectedFacility && selectedBuilding && doSubmitEvent) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole) {
                    selectedTimes.forEach((time) => {
                        console.log(time);
                        registerFixedSchedules(token, selectedFacility, selectedBuilding, startDate, endDate, currDay, time, facilityEvent);
                    });
                    setDoSubmitEvent(false);
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [selectedFacility, selectedBuilding, doSubmitEvent, setDoSubmitEvent]);


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
                            submitType={"register"}
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