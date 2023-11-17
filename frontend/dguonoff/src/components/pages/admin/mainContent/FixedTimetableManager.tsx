import { useEffect, useState, useRef } from "react";
import styles from "./FixedTimetableManager.module.css";
import Building from "../../../../types/Building";
import Facility from "../../../../types/Facility";
import useElementDimensions from "../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../modules/virtualizedTable/VirtualizedTable";
import { Day } from "../../../../types/Day";


/** 고정 시간표 관리 */
export default function FixedTimetableManager() {
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

    const facilityTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "시설물명", style: { width: "75%" } },
        { name: "수용 인원", style: { width: "25%" } },
    ];

    const timetableDaysColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "요일 선택", style: { width: "100%" } },
    ];

    const timetableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "시간표", style: { width: "100%" } },
    ];


    // Ref
    const facilityTable = useRef<HTMLDivElement>(null);
    const timetableDays = useRef<HTMLDivElement>(null);
    const timetable = useRef<HTMLDivElement>(null);



    // State
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(new Building());
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [currDay, setCurrDay] = useState<Day>("월");
    const [hoverDay, sethoverDay] = useState<"Blank" | Day>("월");


    // Hook
    const [facilityTableWidth, facilityTableHeight] = useElementDimensions(facilityTable, "Pure");
    const [timetableDaysWidth, timetableDaysHeight] = useElementDimensions(timetableDays, "Pure");
    const [timetableWidth, timetableHeight] = useElementDimensions(timetable, "Pure");


    // Handler
    const onSelectDay = (day: Day) => {
        setCurrDay(day);
    }

    const onHoverDay = (day: "Blank" | Day) => {
        sethoverDay(day);
    }


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
                <div className={styles.facility_table} ref={facilityTable}>
                    <VirtualizedTable
                        windowHeight={facilityTableHeight - 4}
                        tableStyles={{
                            height: "calc(100% - 4px)",
                            width: "calc(100% - 4px)",
                            overflow: "hidden",
                            borderRadius: "10px",
                            border: "2px solid var(--component-main-color)"
                        }}

                        numColumns={facilityTableColumns.length}
                        columnHeight={35}
                        columnWidths={facilityTableColumns.map((column) => column.style)}
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
                                    {facilityTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={facilities.length}
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
                            const facility = facilities[index];
                            return (
                                <div key={index} id={`${index}`} className={rowClassName}
                                    style={rowStyle}>
                                    <div className={itemClassName} style={itemStyles[0]}>{facility.getName()}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{facility.getCapacity()}</div>
                                </div>
                            );
                        }}
                    />
                </div>
                <div className={styles.facility_timetable}>
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
                </div>
                <div className={styles.event_info}>
                    <div className={styles.event_info__container}>
                        <div className={styles.event_info__header}>
                            이벤트 정보
                        </div>
                        <div className={styles.event_info__body}>
                            <div className={styles.text_field}>
                                <label htmlFor="start-date">이벤트명</label>
                                <input type="text" maxLength={50} />
                            </div>
                            <div className={styles.text_field}>
                                <label htmlFor="start-date">예약자명</label>
                                <input type="text" maxLength={50} />
                            </div>
                            <div className={styles.text_field}>
                                <label htmlFor="start-date">주최자명</label>
                                <input type="text" maxLength={50} />
                            </div>
                            <div className={styles.text_field}>
                                <label htmlFor="start-date">사용인원</label>
                                <input type="text" maxLength={50} />
                            </div>
                            <div className={styles.text_field}>
                                <label htmlFor="start-date">사용용도</label>
                                <input type="text" maxLength={50} />
                            </div>
                            <div className={styles.memo_field}>
                                <label htmlFor="start-date">행사 개요</label>
                                <textarea maxLength={1000} rows={4} />
                            </div>
                            <div className={styles.buttons}>
                                <button className={styles.register}>이벤트 등록</button>
                                <button className={styles.remove}>삭제하기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}