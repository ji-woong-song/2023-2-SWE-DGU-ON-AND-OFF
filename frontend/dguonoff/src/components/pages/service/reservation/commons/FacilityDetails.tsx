import { useNavigate } from "react-router-dom";
import Building from "../../../../../types/Building";
import Facility from "../../../../../types/Facility";
import { ReservationMode } from "../FacilityManager";
import styles from "./FacilityDetails.module.css"
import { getAuthToken, getUserRole, registerBookmark, removeBookmark } from "../../../../../api/dguonandoff";

interface FacilityDetailsProps {
    reservationMode: ReservationMode;
    building: Building;
    selectedFacility: Facility | null;
    setSelectedFacility: React.Dispatch<React.SetStateAction<Facility | null>>;
}

export default function FacilityDetails({ reservationMode, building, selectedFacility, setSelectedFacility }: FacilityDetailsProps) {
    // Const
    const navigate = useNavigate();


    // Handler
    const onRegisterBookmark = async (facility: Facility) => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole) {
            let result = false;
            if (facility.getBookmarked()) {
                result = await removeBookmark(token, facility.getCode(), building.getName());
            } else {
                result = await registerBookmark(token, facility.getCode(), building.getName());
            }
            if (result) setSelectedFacility(new Facility(facility.getName(), facility.getCode(), !facility.getBookmarked(), facility.getStatus(), facility.getCapacity()));
        } else {
            alert("로그인 시간이 만료되었습니다.");
            navigate("/admin/login")
        }
    };

    const onReservation = () => {
        navigate("/reservation");
    };


    // Render
    return (<div className={styles.FacilityDetails}>
        {selectedFacility && (<div className={styles.main}>
            <div className={styles.top}>
                <div onClick={() => { onRegisterBookmark(selectedFacility) }}
                    style={{
                        height: "calc(100% - 7px)",
                        paddingBottom: "7px",
                        width: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "25px",
                        color: `${selectedFacility.getBookmarked() ? "var(--button-positive-color)" : "var(--component-disable-color)"}`
                    }}>
                    {"★"}
                </div >

                <div style={{
                    height: "100%",
                    width: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px",
                    color: `${selectedFacility.getBookmarked() ? "var(--button-positive-color)" : "var(--component-disable-color)"}`
                }}>
                    {reservationMode === "On/Off" && <button className={selectedFacility.getStatus() === "EMPTY" ? styles.manage_button_EMPTY : styles.manage_button_USING} >
                        {selectedFacility.getStatus() === "EMPTY" ? "사용가능" : "사용중"}
                    </button>}
                </div>
            </div>
            <div className={styles.middle} >
                <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>{`${building.getName()} - ${selectedFacility.getName()} `}</div>
                <div style={{ fontSize: "17px", marginBottom: "10px" }}>{`최대인원: ${selectedFacility.getCapacity()}`}</div>
            </div>
            <div className={styles.bottom}>
                {reservationMode === "예약" && <button className={styles.manage_button_reservation} onClick={onReservation}>
                    {"예약하기"}
                </button>}
            </div>
        </div>)}
    </div>);
}