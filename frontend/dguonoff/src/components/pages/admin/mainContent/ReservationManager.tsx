import { useEffect, useRef, useState } from "react";
import styles from "./ReservationManager.module.css";
import Building from "../../../../types/Building";
import Facility from "../../../../types/Facility";
import VirtualizedTable from "../../../../modules/virtualizedTable/VirtualizedTable";
import useElementDimensions from "../../../../hooks/useElementDimensions";
import Reservation, { ReservationStatus } from "../../../../types/Reservation";
import FacilityCategoryTable, { FacilityCategory } from "./commons/FacilityCategoryTable";



export default function ReservationManager() {
    // Const
    const [currFacility, setCurrFacility] = useState<FacilityCategory>("Blank");
    const reservationStatuses: ("all" | ReservationStatus)[] = ["all", "pending", "accept", "reject"];

    const tableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "예약 번호", style: { minWidth: "100px" } },
        { name: "예약자명", style: { minWidth: "100px" } },
        { name: "예약 시설물명", style: { minWidth: "100px" } },
        { name: "예약 날짜 및 시간대", style: { minWidth: "200px" } },
        { name: "예약 상태", style: { minWidth: "100px" } },
    ];

    const totalMinWidth = tableColumns.reduce((acc, column) => {
        return acc + (column.style.minWidth ? parseInt(column.style.minWidth.toString(), 10) : 0);
    }, 0);

    tableColumns.forEach(column => {
        if (column.style.minWidth) {
            const widthPercentage = (parseInt(column.style.minWidth.toString(), 10) / totalMinWidth) * 100;
            column.style.width = `${widthPercentage}%`;
        }
    });


    // Ref
    const reservationTableRef = useRef<HTMLDivElement>(null);


    // State
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(new Building());
    const [selectedReservationStatus, setSelectedReservationStatus] = useState<"all" | ReservationStatus>("all");
    const [reservations, setReservations] = useState<Reservation[]>([]);


    // Hook
    const [reservationTableWidth, reservationTableHeight] = useElementDimensions(reservationTableRef, "Pure");


    // Effect
    useEffect(() => {
        setBuildings([new Building("신공학관", [new Facility("3144")])]);
        setReservations(Array.from({ length: 50 }, (_, index) => {
            return new Reservation(
                (1000 + index).toString(),
                `MJH`,
                new Facility(`신공학관 ${3105 + index}`, Math.floor(Math.random() * 100)),
                new Date(),
                new Date(),
                ["pending", "accept", "reject"][Math.floor(Math.random() * 3)] as ReservationStatus);
        }));
    }, []);


    // Handler
    const statusToString = (status: ReservationStatus | "all"): string => {
        switch (status) {
            case "all":
                return "전체";
            case "pending":
                return "대기";
            case "accept":
                return "승인";
            case "reject":
                return "거절";
            default:
                return "";
        }
    }


    // Render
    return (
        <div className={styles.reservationManager}>
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

                    <div className={styles.status}>
                        <label htmlFor="status-select">예약 상태</label>
                        <select
                            id="status-select"
                            value={selectedReservationStatus}
                            onChange={(e) => setSelectedReservationStatus(reservationStatuses[e.target.selectedIndex])}
                        >
                            {reservationStatuses.map((status, index) => (
                                <option key={index} value={statusToString(status)}>
                                    {statusToString(status)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.reservation_table} ref={reservationTableRef}>
                    <VirtualizedTable
                        windowHeight={reservationTableHeight - 4}
                        tableStyles={{ overflow: "hidden", borderRadius: "10px", border: "2px solid var(--component-main-color)" }}

                        numColumns={tableColumns.length}
                        columnHeight={35}
                        columnWidths={tableColumns.map((column) => column.style)}
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
                                    {tableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={reservations.length}
                        rowHeight={35}
                        rowStyles={{
                            default: {
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "17px",
                                cursor: "pointer",
                                backgroundColor: "var(--component-inner-color)"
                            },
                            hover: {
                                backgroundColor: "var(--component-main-light-color)"
                            }
                        }}
                        renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                            const reservation = reservations[index];
                            return (
                                <div key={index} id={`${index}`} className={rowClassName}
                                    style={rowStyle}>
                                    <div className={itemClassName} style={itemStyles[0]}>{reservation.getId()}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{reservation.getReserver()}</div>
                                    <div className={itemClassName} style={itemStyles[2]}>{reservation.getFacility().getName()}</div>
                                    <div className={itemClassName} style={itemStyles[3]}>{
                                        (() => {
                                            const startTime = reservation.getStartTime().toISOString();
                                            const endTime = reservation.getEndTime().toISOString();
                                            return `${startTime.split('T')[0]} - 
                                        ${startTime.split('T')[1].split(':')[0]}:${startTime.split('T')[1].split(':')[1]} ~ 
                                        ${endTime.split('T')[1].split(':')[0]}:${endTime.split('T')[1].split(':')[1]}`;
                                        })()
                                    }
                                    </div>
                                    <div className={itemClassName} style={itemStyles[4]}>
                                        <button className={`${styles.manage_button} ${styles['manage_button_' + reservation.getStatus()]}`}
                                            onClick={() => { /* TODO: 상세 및 승인여부 모달 구현 필요 */ }}>
                                            {statusToString(reservation.getStatus())}
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div >
        </div>
    );
};
