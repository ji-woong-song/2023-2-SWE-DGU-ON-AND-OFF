import { useRef, useState } from "react";
import styles from "./FacilityTimetable.module.css";
import { Day, dayToKor } from "../../../../../../types/Day";
import useElementDimensions from "../../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../../modules/virtualizedTable/VirtualizedTable";


export interface FacilityTimetableProps {
    currDay: Day;
    setCurrDay: React.Dispatch<React.SetStateAction<Day>>;
    selectedTimes: Date[];
    setSelectedTimes: React.Dispatch<React.SetStateAction<Date[]>>
}


export default function FacilityTimetable({ currDay, setCurrDay, selectedTimes, setSelectedTimes }: FacilityTimetableProps) {
    // Const
    const days: Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const timeIntervals = Array.from({ length: 32 }, (_, index) => {
        const startTime = new Date();
        startTime.setHours(8, 0, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + 30 * index);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        return { start: startTime, end: endTime };
    });

    const timetableDaysColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "요일 선택", style: { width: "100%" } },
    ];

    const timetableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "시간표", style: { width: "100%" } },
    ];


    // Ref
    const timetableDays = useRef<HTMLDivElement>(null);
    const timetable = useRef<HTMLDivElement>(null);


    // State
    const [hoverDay, sethoverDay] = useState<"Blank" | Day>("MONDAY");


    // Hook
    const [timetableDaysWidth, timetableDaysHeight] = useElementDimensions(timetableDays, "Pure");
    const [timetableWidth, timetableHeight] = useElementDimensions(timetable, "Pure");


    // Handler
    const onSelectDay = (day: Day) => {
        setCurrDay(day);
    }

    const onHoverDay = (day: "Blank" | Day) => {
        sethoverDay(day);
    }

    const compareTime = (date1: Date, date2: Date): boolean => {
        const hours1 = date1.getHours();
        const minutes1 = date1.getMinutes();
        const hours2 = date2.getHours();
        const minutes2 = date2.getMinutes();
        return hours1 === hours2 && minutes1 === minutes2;
    }

    const onSelectTime = (selectedTime: Date) => {
        if (selectedTimes.some((time) => compareTime(time, selectedTime))) {
            setSelectedTimes(selectedTimes.filter((time) => !compareTime(time, selectedTime)));
        } else {
            setSelectedTimes([...selectedTimes, selectedTime]);
        }
    }


    // Render
    return (<div className={styles.facilityTimetable}>
        <div className={styles.timetable_days} ref={timetableDays}>
            <VirtualizedTable
                windowHeight={timetableDaysHeight - 4}
                tableStyles={{
                    height: "calc(100% - 4px)",
                    width: "calc(100% - 4px)",
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "2px solid var(--component-main-color)"
                }}
                hideScrollbar={true}

                numColumns={timetableDaysColumns.length}
                columnHeight={35}
                columnWidths={timetableDaysColumns.map((column) => column.style)}
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
                            {timetableDaysColumns[index].name}
                        </div>
                    );
                }}

                numRows={1}
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
                    return (
                        <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                            <div className={itemClassName} style={itemStyles[0]}>
                                <table className={styles.day_select}>
                                    <tbody>
                                        <tr>
                                            {days.map((day, index) => (
                                                <td key={index}
                                                    className={styles.day}
                                                    onClick={() => onSelectDay(day)}
                                                    onMouseOver={() => onHoverDay(day)}
                                                    onMouseLeave={() => onHoverDay("Blank")}
                                                    style={{
                                                        color: currDay === day || hoverDay === day ?
                                                            'var(--component-innertext-select-color)' : 'var(--component-innertext-color)',
                                                        backgroundColor: currDay === day || hoverDay === day ?
                                                            'var(--component-main-color)' : 'var(--component-inner-color)',
                                                    }}>
                                                    {dayToKor(day)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
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
                                selectedTimes.some((time) => compareTime(time, timeInterval.start)) ? {
                                    ...rowStyle,
                                    color: 'var(--component-innertext-select-color)',
                                    backgroundColor: 'var(--component-main-color)'
                                } : {
                                    ...rowStyle
                                }}>
                            <div className={itemClassName} style={itemStyles[0]}>{
                                `${newStart.toISOString().split('T')[1].split(':')[0]}:${newStart.toISOString().split('T')[1].split(':')[1]} ~ 
                                            ${newEnd.toISOString().split('T')[1].split(':')[0]}:${newEnd.toISOString().split('T')[1].split(':')[1]}`
                            }</div>
                        </div>
                    );
                }}
            />
        </div>
    </div>)
}