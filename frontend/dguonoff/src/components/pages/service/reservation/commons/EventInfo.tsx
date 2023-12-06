import React, { useRef, useState } from "react";
import { SelectedBuildingContext, SelectedFacilityContext } from "../../../../../App";
import styles from "./EventInfo.module.css";
import { Day } from "../../../../../types/Day";
import FacilitySchedule from "../../../../../types/FacilitySchedule";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import { getAuthToken, getUserRole, registerReservation } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";


interface EventInfoProps {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    currDay: Day;
    setCurrDay: React.Dispatch<React.SetStateAction<Day>>;
    selectedTimes: Date[];
    setSelectedTimes: React.Dispatch<React.SetStateAction<Date[]>>;
    facilitySchedules: FacilitySchedule[];
    setFacilitySchedules: React.Dispatch<React.SetStateAction<FacilitySchedule[]>>;
    selectedFacilitySchedule: FacilitySchedule | null;
    setSelectedFacilitySchedule: React.Dispatch<React.SetStateAction<FacilitySchedule | null>>
}


export default function EventInfo({
    date,
    setDate,
    currDay,
    setCurrDay,
    selectedTimes,
    setSelectedTimes,
    facilitySchedules,
    setFacilitySchedules,
    selectedFacilitySchedule,
    setSelectedFacilitySchedule }: EventInfoProps
) {
    // Const
    const navigate = useNavigate();
    const guestTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "", style: { width: "50px" } },
        { name: "예약 인원", style: { width: "calc(100% - 50px)" } },
    ];

    // Ref
    const guestTable = useRef<HTMLDivElement>(null);
    const guestText = useRef<HTMLInputElement>(null);


    // State
    const [hostName, setHostName] = useState<string>("");
    const [purpose, setPurpose] = useState<string>("");
    const [guestIds, setGuestIds] = useState<string[]>([]);


    // Context
    const { selectedFacility, setSelectedFacility } = React.useContext(SelectedFacilityContext);
    const { selectedBuilding, setSelectedBuilding } = React.useContext(SelectedBuildingContext);


    // Hook
    const guestTableHeight = useElementDimensions(guestTable, "Pure")[1];


    // Handler
    const onReservation = () => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
            selectedTimes.forEach(async (startTime) => {
                const endTime = new Date(startTime);
                endTime.setMinutes(endTime.getMinutes() + 30);
                if (selectedFacility && selectedBuilding) {
                    await registerReservation(token, hostName, date, startTime, endTime, selectedFacility, selectedBuilding, purpose, guestIds);
                }
            });
            navigate("/facility");
        } else {
            alert("로그인 시간이 만료되었습니다.");
            navigate("/admin/login")
        }
    };


    // Render
    return (<div className={styles.EventInfo}>
        <div className={styles.top}>
            <div style={{ fontSize: "25px", fontWeight: "600" }}>이용 정보</div>
        </div>

        <div className={styles.middle}>
            <div className={styles.basic_info}>
                <div className={styles.text_field}>
                    <label htmlFor="start-date">예약자명</label>
                    <input type="text" maxLength={50} value={hostName} onChange={(e) => { setHostName(e.target.value); }} />
                </div>
                <div className={styles.text_field}>
                    <label htmlFor="start-date">사용용도</label>
                    <input type="text" maxLength={50} value={purpose} onChange={(e) => { setPurpose(e.target.value); }} />
                </div>
            </div>
            <div className={styles.guests}>
                <div className={styles.add_guest}>
                    <input type="text" maxLength={50} placeholder="ID 입력" ref={guestText} />
                    <button className={styles.manage_button_add} onClick={() => {
                        if (guestText.current) {
                            if (guestText.current.value.length === 0) {
                                alert("게스트 ID를 입력하세요")
                            } else {
                                setGuestIds([...guestIds, guestText.current.value]);
                                guestText.current.value = "";
                            }
                        }
                    }}>
                        {"게스트 추가"}
                    </button>
                </div>
                <div className={styles.guest_table} ref={guestTable}>
                    <VirtualizedTable
                        windowHeight={guestTableHeight - 4}
                        tableStyles={{
                            height: "calc(100% - 4px)",
                            width: "calc(100% - 4px)",
                            overflow: "hidden",
                            borderRadius: "10px",
                            border: "2px solid var(--component-main-color)"
                        }}

                        numColumns={guestTableColumns.length}
                        columnHeight={35}
                        columnWidths={guestTableColumns.map((column) => column.style)}
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
                                    {guestTableColumns[index].name}
                                </div>
                            );
                        }}

                        numRows={guestIds.length}
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
                            const guest = guestIds[index];
                            return (
                                <div key={index} id={`${index}`} className={rowClassName} style={rowStyle}>
                                    <div className={itemClassName} style={{ ...itemStyles[0], color: "red", fontSize: "25px" }}
                                        onClick={() => {
                                            let newGuestIds = [...guestIds];
                                            newGuestIds.splice(index, 1);
                                            setGuestIds(newGuestIds);
                                        }}
                                    >{"\u2296"}</div>
                                    <div className={itemClassName} style={itemStyles[1]}>{guest}</div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>

        <div className={styles.bottom}>
            <button className={styles.manage_button_reservation} onClick={() => { onReservation() }}>
                {"예약하기"}
            </button>
        </div>
    </div>)
}