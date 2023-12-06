import { useEffect, useState } from "react";
import styles from "./FixedTimetableManager.module.css";
import FacilityTable from "./commons/FacilityTable";
import FacilityTimetable from "./commons/FacilityTimetable";
import FacilityEventInfo from "./commons/FacilityEventInfo";
import Building from "../../../../../types/Building";
import Facility from "../../../../../types/Facility";
import { Day } from "../../../../../types/Day";
import { deleteFixedSchedule, getAuthToken, getFacilities, getFixedSchedules, getUserRole, modifyFixedSchedule, registerFixedSchedule } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";
import { FacilityEvent } from "../../../../../types/FacilityEvent";
import FacilitySchedule from "../../../../../types/FacilitySchedule";


interface FixedTimetableManagerParams {
    buildings: Building[];
}



/** 고정 시간표 관리 */
export default function FixedTimetableManager({ buildings }: FixedTimetableManagerParams) {
    // Const
    const navigate = useNavigate();


    // State
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [currDay, setCurrDay] = useState<Day>("MONDAY");
    const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
    const [facilityEvent, setFacilityEvent] = useState<FacilityEvent>(new FacilityEvent('', '', '', '', 0));
    const [doSubmitEvent, setDoSubmitEvent] = useState<boolean>(false);
    const [doRemoveEvent, setDoRemoveEvent] = useState<boolean>(false);
    const [facilitySchedules, setFacilitySchedules] = useState<FacilitySchedule[]>([]);
    const [selectedFacilitySchedule, setSelectedFacilitySchedule] = useState<FacilitySchedule | null>(null);


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
                if (token && userRole && userRole !== "NORMAL") {
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
    }, [navigate, selectedBuilding]);

    useEffect(() => {
        if (selectedFacility && selectedBuilding) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole && userRole !== "NORMAL") {
                    setFacilitySchedules(await getFixedSchedules(token, currDay, startDate, endDate, selectedFacility, selectedBuilding));
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [navigate, currDay, endDate, startDate, selectedFacility, selectedBuilding]);

    useEffect(() => {
        if (selectedFacility && selectedBuilding && doSubmitEvent) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole && userRole !== "NORMAL") {
                    if (selectedFacilitySchedule) {
                        await modifyFixedSchedule(token, selectedFacilitySchedule, selectedFacility, selectedBuilding, startDate, endDate, currDay, facilityEvent);
                        setSelectedFacilitySchedule(null);
                    } else {
                        // 고정 시간표 추가
                        selectedTimes.forEach(async (startTime) => {
                            const endTime = new Date(startTime);
                            endTime.setMinutes(endTime.getMinutes() + 30);
                            await registerFixedSchedule(token, selectedFacility, selectedBuilding, startDate, endDate, currDay, startTime, endTime, facilityEvent);
                        });
                        setSelectedTimes([]);
                    }
                  //  setFacilitySchedules();
                    setFacilityEvent(new FacilityEvent('', '', '', '', 0));
                    console.log(await getFixedSchedules(token, currDay, startDate, endDate, selectedFacility, selectedBuilding))
                    setDoSubmitEvent(false);
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [navigate, currDay, endDate, startDate, facilityEvent, selectedFacility, selectedBuilding, selectedFacilitySchedule, setSelectedFacilitySchedule, selectedTimes, setSelectedTimes, doSubmitEvent, setDoSubmitEvent]);

    useEffect(() => {
        if (selectedFacility && selectedBuilding && doRemoveEvent) {
            (async () => {
                const [token, userRole] = [getAuthToken(), getUserRole()];
                if (token && userRole && userRole !== "NORMAL") {
                    if (selectedFacilitySchedule) {
                        await deleteFixedSchedule(token, selectedFacilitySchedule);
                        setSelectedFacilitySchedule(null);
                    }
                    setFacilitySchedules(await getFixedSchedules(token, currDay, startDate, endDate, selectedFacility, selectedBuilding));
                    setFacilityEvent(new FacilityEvent('', '', '', '', 0));
                    setDoRemoveEvent(false);
                } else {
                    alert("로그인 시간이 만료되었습니다.");
                    navigate("/admin/login")
                }
            })();
        }
    }, [navigate, currDay, endDate, startDate, selectedFacility, selectedBuilding, selectedFacilitySchedule, setSelectedFacilitySchedule, doRemoveEvent, setDoRemoveEvent]);


    // Render
    return (
        <div className={styles.fixedTimetableManager}>
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
                            facilitySchedules={facilitySchedules}
                            selectedFacilitySchedule={selectedFacilitySchedule}
                            setSelectedFacilitySchedule={setSelectedFacilitySchedule}
                        />
                    </div>
                    <div className={styles.event_info}>
                        <FacilityEventInfo
                            submitType={"register"}
                            facilityEvent={facilityEvent}
                            selectedFacilitySchedule={selectedFacilitySchedule}
                            setDoSubmitEvent={setDoSubmitEvent}
                            setDoRemoveEvent={setDoRemoveEvent}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}