import { useRef, useState } from "react";
import styles from "./FacilityTimetable.module.css";
import { Day } from "../../../../../../types/Day";
import useElementDimensions from "../../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../../modules/virtualizedTable/VirtualizedTable";


export interface FacilityTimetableProps {
    currDay: Day;
    setCurrDay: React.Dispatch<React.SetStateAction<Day>>;
}


export default function FacilityTimetable({ currDay, setCurrDay }: FacilityTimetableProps) {
    // Const
    const days: Day[] = ["월", "화", "수", "목", "금", "토", "일"];
    const timeIntervals = Array.from({ length: 32 }, (_, index) => {
        const kstOffset = 9;
        const startTime = new Date();
        startTime.setHours(8 + kstOffset, 0, 0, 0);
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
    const [hoverDay, sethoverDay] = useState<"Blank" | Day>("월");


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
                                                    {day}
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
                    const timeInterval = timeIntervals[index];
                    return (
                        <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                            <div className={itemClassName} style={itemStyles[0]}>{
                                `${timeInterval.start.toISOString().split('T')[1].split(':')[0]}:${timeInterval.start.toISOString().split('T')[1].split(':')[1]} ~ 
                                            ${timeInterval.end.toISOString().split('T')[1].split(':')[0]}:${timeInterval.end.toISOString().split('T')[1].split(':')[1]}`
                            }</div>
                        </div>
                    );
                }}
            />
        </div>
    </div>)
}