import { useRef } from "react";
import styles from "./FloorFacilityTable.module.css";
import Facility from "../../../../../types/Facility";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import { ReservationMode } from "../FacilityManager";
import { getAuthToken, getFacilities, getUserRole, registerBookmark, removeBookmark } from "../../../../../api/dguonandoff";
import Building from "../../../../../types/Building";
import { useNavigate } from "react-router-dom";



export interface FloorFacilityTableProps {
    reservationMode: ReservationMode;
    floor: number;
    building: Building;
    facilities: Facility[];
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
    selectedFacility: Facility | null;
    setSelectedFacility: React.Dispatch<React.SetStateAction<Facility | null>>;
}


export default function FloorFacilityTable({ reservationMode, floor, building, facilities, setFacilities, selectedFacility, setSelectedFacility }: FloorFacilityTableProps) {
    // Const
    const navigate = useNavigate();
    const facilityTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: `${floor > 0 ? `${floor}층` : "해당 건물에는 층이 없습니다"}`, style: { width: "100%" } },
    ];


    // Ref
    const facilityTable = useRef<HTMLDivElement>(null);


    // Hook
    const facilityTableHeight = useElementDimensions(facilityTable, "Pure")[1];


    // Handler
    const onRegisterBookmark = async (facility: Facility) => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
            if (facility.getBookmarked()) {
                await removeBookmark(token, facility.getCode(), building.getName());
            } else {
                await registerBookmark(token, facility.getCode(), building.getName());
            }
            let newFacilities: Facility[] = await getFacilities(token, floor, building.getName());
            setFacilities(newFacilities);
            setSelectedFacility(new Facility(facility.getName(), facility.getCode(), !facility.getBookmarked(), facility.getStatus(), facility.getCapacity()));
        } else {
            alert("로그인 시간이 만료되었습니다.");
            navigate("/admin/login")
        }
    };


    // Render
    return (<div className={styles.facilityTable} ref={facilityTable}>
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
            columnHeight={40}
            columnWidths={facilityTableColumns.map((column) => column.style)}
            columnStyles={{
                userSelect: "none",
                backgroundColor: "var(--component-main-light-color)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
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
            rowHeight={50}
            rowStyles={{
                default: {
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
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
                        onClick={() => { setSelectedFacility(facility) }}
                        style={(selectedFacility && facility.getCode() === selectedFacility.getCode()) ? {
                            ...rowStyle,
                            color: 'var(--component-innertext-select-color)',
                            backgroundColor: 'var(--component-main-color)'
                        } : {
                            ...rowStyle
                        }}>
                        <div className={itemClassName} style={{ ...itemStyles[0], display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {reservationMode === "예약" ? (<>
                                <div style={{ height: "100%", width: "90%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {facility.getName()}
                                </div>
                                <div onClick={() => { onRegisterBookmark(facility) }}
                                    style={{
                                        height: "calc(100% - 7px)",
                                        paddingBottom: "7px",
                                        width: "10%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "25px",
                                        color: `${facility.getBookmarked() ? "var(--button-positive-color)" : "var(--component-disable-color)"}`
                                    }}>
                                    {"★"}
                                </div>
                            </>) : (<>
                                <div style={{ height: "100%", width: "65%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {facility.getName()}
                                </div>
                                <div style={{ height: "100%", width: "25%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <button className={facility.getStatus() === "EMPTY" ? styles.manage_button_EMPTY : styles.manage_button_USING}>
                                        {facility.getStatus() === "EMPTY" ? "사용가능" : "사용중"}
                                    </button>
                                </div>
                                <div onClick={() => { onRegisterBookmark(facility) }}
                                    style={{
                                        height: "calc(100% - 7px)",
                                        paddingBottom: "7px",
                                        width: "10%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "25px",
                                        color: `${facility.getBookmarked()
                                            || (facility.getCode() === selectedFacility?.getCode() && selectedFacility.getBookmarked())
                                            ? "var(--button-positive-color)" : "var(--component-disable-color)"}`
                                    }}>
                                    {"★"}
                                </div>
                            </>)}
                        </div>
                    </div>
                );
            }}
        />
    </div >);
}