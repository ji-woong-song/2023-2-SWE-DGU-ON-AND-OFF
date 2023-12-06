import { useRef } from "react";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import FacilitySchedule from "../../../../../types/FacilitySchedule";
import styles from "./SelectTime.module.css";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import { ReservationProcess } from "../ReservationManager";


interface SelectTimeProps {
    setCurrProcess: React.Dispatch<React.SetStateAction<ReservationProcess>>;
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    selectedTimes: Date[];
    setSelectedTimes: React.Dispatch<React.SetStateAction<Date[]>>;
    facilitySchedules: FacilitySchedule[];
    selectedFacilitySchedule: FacilitySchedule | null;
    setSelectedFacilitySchedule: React.Dispatch<React.SetStateAction<FacilitySchedule | null>>
}


export default function SelectTime({
    setCurrProcess,
    date,
    setDate,
    selectedTimes,
    setSelectedTimes,
    facilitySchedules,
    selectedFacilitySchedule,
    setSelectedFacilitySchedule }: SelectTimeProps
) {
    // Const
    const timeIntervals = Array.from({ length: 32 }, (_, index) => {
        const startTime = new Date();
        startTime.setHours(8, 0, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + 30 * index);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        return { start: startTime, end: endTime };
    });
    const timetableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "시간표", style: { width: "100%" } },
    ];


    // Ref
    const timetable = useRef<HTMLDivElement>(null);


    // Hook
    const timetableHeight = useElementDimensions(timetable, "Pure")[1];


    // Handler
    const compareTime = (date1: Date, date2: Date): boolean => {
        const hours1 = date1.getHours();
        const minutes1 = date1.getMinutes();
        const hours2 = date2.getHours();
        const minutes2 = date2.getMinutes();
        return hours1 === hours2 && minutes1 === minutes2;
    }

    const onSelectTime = (selectedTime: Date) => {
        const regisedSchedule = facilitySchedules.find((schedule) => compareTime(schedule.getStartTime(), selectedTime));
        if (regisedSchedule) {
            if (selectedFacilitySchedule && compareTime(regisedSchedule.getStartTime(), selectedFacilitySchedule.getStartTime())) {
                setSelectedFacilitySchedule(null);
            } else {
                setSelectedFacilitySchedule(regisedSchedule);
                setSelectedTimes([]);
            }
        } else {
            if (selectedTimes.some((time) => compareTime(time, selectedTime))) {
                setSelectedTimes(selectedTimes.filter((time) => !compareTime(time, selectedTime)));
            } else {
                setSelectedFacilitySchedule(null);
                setSelectedTimes([...selectedTimes, selectedTime]);
            }
        }
    }



    // Render
    return (<div className={styles.SelectTime}>
        <div className={styles.top}>
            <div className={styles.period}>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setDate(newDate);
                    }}
                />
            </div>
        </div>

        <div className={styles.middle}>
            <div className={styles.timetable} ref={timetable}>
                <VirtualizedTable
                    windowHeight={timetableHeight - 4}
                    tableStyles={{
                        height: "calc(100% - 4px)",
                        width: "calc(100% - 4px)",
                        overflow: "hidden",
                        borderRadius: "10px",
                        border: "2px solid var(--component-main-color)"
                    }}

                    numColumns={timetableColumns.length}
                    columnHeight={35}
                    columnWidths={timetableColumns.map((column) => column.style)}
                    columnStyles={{
                        userSelect: "none",
                        backgroundColor: "var(--component-main-light-color)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "17px",
                        fontWeight: "600"
                    }}
                    renderColumns={({ index, columnClassName, columnStyle }) => {
                        return (
                            <div key={index} className={columnClassName}
                                style={columnStyle}>
                                {timetableColumns[index].name}
                            </div>
                        );
                    }}

                    numRows={timeIntervals.length}
                    rowHeight={45}
                    rowStyles={{
                        default: {
                            userSelect: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "20px",
                            cursor: "pointer",
                            backgroundColor: "var(--component-inner-color)"
                        },
                        hover: {
                            backgroundColor: "var(--component-main-light-color)"
                        }
                    }}
                    renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                        const kstOffset = 9;
                        const timeInterval = timeIntervals[index];
                        const newStart = new Date(timeInterval.start);
                        const newEnd = new Date(timeInterval.end);
                        newStart.setHours(newStart.getHours() + kstOffset);
                        newEnd.setHours(newEnd.getHours() + kstOffset);

                        return (
                            <div key={index} id={`${index}`} className={rowClassName}
                                onClick={() => { onSelectTime(timeInterval.start) }}
                                style={
                                    facilitySchedules.some((schedule) => compareTime(schedule.getStartTime(), timeInterval.start)) ? (
                                        (selectedFacilitySchedule && compareTime(selectedFacilitySchedule.getStartTime(), timeInterval.start)) ? {
                                            ...rowStyle,
                                            color: 'var(--component-innertext-select-color)',
                                            backgroundColor: 'var(--component-disable-color)'
                                        } : {
                                            ...rowStyle,
                                            backgroundColor: 'var(--component-disable-light-color)'
                                        }) : (selectedTimes.some((time) => compareTime(time, timeInterval.start)) ? {
                                            ...rowStyle,
                                            color: 'var(--component-innertext-select-color)',
                                            backgroundColor: 'var(--component-main-color)'
                                        } : {
                                            ...rowStyle
                                        })}>
                                <div className={itemClassName} style={itemStyles[0]}>{
                                    `${newStart.toISOString().split('T')[1].split(':')[0]}:${newStart.toISOString().split('T')[1].split(':')[1]} ~ 
                                            ${newEnd.toISOString().split('T')[1].split(':')[0]}:${newEnd.toISOString().split('T')[1].split(':')[1]}`
                                }</div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>

        <div className={styles.bottom}>
            <button className={styles.manage_button_reservation} onClick={() => { setCurrProcess("이벤트 정보"); }}>
                {"예약하기"}
            </button>
        </div>
    </div>);
}