import { useEffect, useRef, useState } from "react";
import styles from "./ReservationManager.module.css";
import FacilityCategoryTable, { FacilityCategory } from "./commons/FacilityCategoryTable";
import Reservation, { ReservationStatus } from "../../../../../types/Reservation";
import Building from "../../../../../types/Building";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import { useModal } from "../../../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../../../modules/modal/ModalAnimations";
import { approveReservation, getAuthToken, getReservations, getUserRole, rejectReservation } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";


interface ReservationManagerParams {
    buildings: Building[];
}

export default function ReservationManager({ buildings }: ReservationManagerParams) {
    // Const
    const navigate = useNavigate();
    const [currFacility, setCurrFacility] = useState<FacilityCategory>("강의실");
    const reservationStatuses: ("ALL" | ReservationStatus)[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

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
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(new Building("전체"));
    const [selectedReservationStatus, setSelectedReservationStatus] = useState<"ALL" | ReservationStatus>("ALL");
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [refreshReservation, setRefreshReservation] = useState<boolean>(true);


    // Hook
    const reservationTableHeight = useElementDimensions(reservationTableRef, "Pure")[1];
    const [ReservationDetailsModal, openReservationDetailsModal, closeReservationDetailsModal] = useModal(ModalAnimationType.ZOOM);


    // Handler
    const onReject = async (reservation: Reservation) => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
            await rejectReservation(token, reservation);
            closeReservationDetailsModal();
            setRefreshReservation(!refreshReservation);
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
    }

    const onApprove = async (reservation: Reservation) => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
            await approveReservation(token, reservation);
            closeReservationDetailsModal();
            setRefreshReservation(!refreshReservation);
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
    }


    // Effect
    useEffect(() => {
        const currDate = new Date();
        currDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate());
        nextDate.setHours(0, 0, 0, 0);
        nextDate.setSeconds(nextDate.getSeconds() - 1);
        setStartDate(currDate);
        setEndDate(nextDate);
    }, [setStartDate, setEndDate]);


    useEffect(() => {
        (async () => {
            const [token, userRole] = [getAuthToken(), getUserRole()];
            if (token && userRole) {
                const reservationsResponse = await getReservations(token);
                const stringToDate = (dateStr: string): Date => {
                    const [year, month, day] = dateStr.split("-").map(Number);
                    return new Date(year, month - 1, day);
                };
                setReservations(reservationsResponse);
                setFilteredReservations(reservationsResponse.filter((reservation) => startDate <= stringToDate(reservation.getDate()) && stringToDate(reservation.getDate()) <= endDate))
            } else {
                alert("권한이 없습니다.");
                navigate("/admin/login")
            }
        })();
    }, [navigate, setReservations, startDate, endDate]);

    useEffect(() => {
        const stringToDate = (dateStr: string): Date => {
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day);
        };

        let newReservations = reservations.filter((reservation) => startDate <= stringToDate(reservation.getDate()) && stringToDate(reservation.getDate()) <= endDate);
        newReservations = newReservations.filter((reservation) => selectedBuilding.getName() === "전체" || selectedBuilding.getName() === reservation.getBuildingName());
        newReservations = newReservations.filter((reservation) => selectedReservationStatus === "ALL" || selectedReservationStatus === reservation.getStatus());
        setFilteredReservations(newReservations);

    }, [startDate, endDate, selectedBuilding, reservations, selectedReservationStatus, refreshReservation]);


    // Handler
    const statusToString = (status: "ALL" | ReservationStatus): string => {
        switch (status) {
            case "ALL":
                return "전체";
            case "PENDING":
                return "대기";
            case "APPROVED":
                return "승인";
            case "REJECTED":
                return "거절";
            default:
                return "";
        }
    }

    const openReservationDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        openReservationDetailsModal();
    };


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
                            onChange={(e) => {
                                const newStartDate = new Date(e.target.value);
                                newStartDate.setHours(0, 0, 0, 0); // 자정으로 설정
                                setStartDate(newStartDate);
                            }}
                        />

                        <span>~</span>

                        <input
                            type="date"
                            id="end-date"
                            name="end-date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                                const newEndDate = new Date(e.target.value);
                                newEndDate.setHours(23, 59, 59, 999); // 하루의 끝으로 설정
                                setEndDate(newEndDate);
                            }}
                        />
                    </div>

                    <div className={styles.building}>
                        <label htmlFor="building-select">건물 코드</label>
                        <select
                            id="building-select"
                            onChange={(e) => setSelectedBuilding([new Building("전체"), ...buildings][e.target.selectedIndex])}
                        >
                            {[new Building("전체"), ...buildings].map((building, index) => (
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

                        numRows={filteredReservations.length}
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
                            const reservation = filteredReservations[index];
                            return (
                                <div key={index} id={`${index}`} className={rowClassName}
                                    style={rowStyle}>
                                    <div className={itemClassName} style={itemStyles[0]}>{reservation.getReservationId()}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{reservation.getTitle()}</div>
                                    <div className={itemClassName} style={itemStyles[2]}>{reservation.getFacilityName()}</div>
                                    <div className={itemClassName} style={itemStyles[3]}>{`${reservation.getDate()}, ${reservation.getStartTime()} ~ ${reservation.getEndTime()}`}
                                    </div>
                                    <div className={itemClassName} style={itemStyles[4]}>
                                        <button className={`${styles.manage_button} ${styles['manage_button_' + reservation.getStatus()]}`}
                                            onClick={() => { openReservationDetails(reservation); }}>
                                            {statusToString(reservation.getStatus())}
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div >

            {selectedReservation && (
                <ReservationDetailsModal>
                    <div className={styles.reservation_details}>
                        <div className={styles.top}>
                            예약 상세 정보
                        </div>
                        <div className={styles.middle}>
                            <div className={styles.head}>
                                <label htmlFor="user-name">예약자명</label>
                                <label htmlFor="use-purpose">사용 목적</label>
                                <label htmlFor="date-time">날짜 및 시간</label>
                                <label htmlFor="group-info">예약 인원 및 정보</label>
                            </div>
                            <div className={styles.data}>
                                <label htmlFor="user-name">{"undefined"}</label>
                                <label htmlFor="use-purpose">{selectedReservation.getPurpose()}</label>
                                <label htmlFor="date-time">{`${selectedReservation.getDate()}, ${selectedReservation.getStartTime()} ~ ${selectedReservation.getEndTime()}`}</label>
                                <label htmlFor="group-info">{`${"undefined"} 외 ${selectedReservation.getGuests().length}명`}</label>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <button className={styles.APPROVED} onClick={() => { onReject(selectedReservation) }}>예약 승인</button>
                            <button className={styles.REJECTED} onClick={() => { onApprove(selectedReservation) }}>예약 거절</button>
                        </div>
                    </div>
                </ReservationDetailsModal>
            )}
        </div>
    );
};