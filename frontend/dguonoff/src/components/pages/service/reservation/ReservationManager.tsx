import React, { useState, useEffect, useRef } from "react";
import styles from "./ReservationManager.module.css"
import { Day } from "../../../../types/Day";
import FacilitySchedule from "../../../../types/FacilitySchedule";
import { SelectedBuildingContext, SelectedFacilityContext } from "../../../../App";
import SelectTime from "./commons/SelectTime";
import EventInfo from "./commons/EventInfo";


export type ReservationProcess = "날짜 선택" | "이벤트 정보";


export default function ReservationManager() {
    // State
    const [currProcess, setCurrProcess] = useState<ReservationProcess>("날짜 선택");
    const [date, setDate] = useState<Date>(new Date());
    const [currDay, setCurrDay] = useState<Day>("MONDAY");
    const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
    const [facilitySchedules, setFacilitySchedules] = useState<FacilitySchedule[]>([]);
    const [selectedFacilitySchedule, setSelectedFacilitySchedule] = useState<FacilitySchedule | null>(null);


    // Handler
    const getContentComponent = () => {
        switch (currProcess) {
            case "날짜 선택": {
                return <SelectTime
                    setCurrProcess={setCurrProcess}
                    date={date}
                    setDate={setDate}
                    currDay={currDay}
                    setCurrDay={setCurrDay}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    facilitySchedules={facilitySchedules}
                    setFacilitySchedules={setFacilitySchedules}
                    selectedFacilitySchedule={selectedFacilitySchedule}
                    setSelectedFacilitySchedule={setSelectedFacilitySchedule}
                />;
            }
            case "이벤트 정보": {
                return <EventInfo
                    date={date}
                    setDate={setDate}
                    currDay={currDay}
                    setCurrDay={setCurrDay}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    facilitySchedules={facilitySchedules}
                    setFacilitySchedules={setFacilitySchedules}
                    selectedFacilitySchedule={selectedFacilitySchedule}
                    setSelectedFacilitySchedule={setSelectedFacilitySchedule}
                />;
            }
            default: {
                return <></>;
            }
        }
    };


    // Render
    return (<div className={styles.ReservationManager}>
        {getContentComponent()}
    </div >)
}
