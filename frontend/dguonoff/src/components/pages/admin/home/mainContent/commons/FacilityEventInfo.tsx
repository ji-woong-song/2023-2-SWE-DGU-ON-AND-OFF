import { FacilityEvent } from "../../../../../../types/FacilityEvent";
import FacilitySchedule from "../../../../../../types/FacilitySchedule";
import styles from "./FacilityEventInfo.module.css";
import { useEffect, useState } from "react";


export interface FacilityEventInfoProps {
    submitType: "register" | "modify";
    facilityEvent: FacilityEvent;
    selectedFacilitySchedule: FacilitySchedule | null;
    setDoSubmitEvent: React.Dispatch<React.SetStateAction<boolean>>;
    setDoRemoveEvent: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function FacilityEventInfo({ submitType, facilityEvent, selectedFacilitySchedule, setDoSubmitEvent, setDoRemoveEvent }: FacilityEventInfoProps) {
    // State
    const [eventName, setEventName] = useState<string>("");
    const [hostName, setHostName] = useState<string>("");
    const [guestNumber, setGuestNumber] = useState<string>("");
    const [purpose, setPurpose] = useState<string>("");
    const [outline, setOutline] = useState<string>("");


    // Effect
    useEffect(() => {
        if (selectedFacilitySchedule) {
            setEventName(selectedFacilitySchedule.getEvent().getName());
            setHostName(selectedFacilitySchedule.getEvent().getHostName());
            setGuestNumber(selectedFacilitySchedule.getEvent().getGuestNumber().toString());
            setPurpose(selectedFacilitySchedule.getEvent().getPurpose());
            setOutline(selectedFacilitySchedule.getEvent().getOutline());

            facilityEvent.setName(selectedFacilitySchedule.getEvent().getName());
            facilityEvent.setHostName(selectedFacilitySchedule.getEvent().getHostName());
            facilityEvent.setGuestNumber(selectedFacilitySchedule.getEvent().getGuestNumber());
            facilityEvent.setPurpose(selectedFacilitySchedule.getEvent().getPurpose());
            facilityEvent.setOutline(selectedFacilitySchedule.getEvent().getOutline());
        } else {
            setEventName("");
            setHostName("");
            setGuestNumber("");
            setPurpose("");
            setOutline("");
        }
    }, [facilityEvent, selectedFacilitySchedule]);


    // Render
    return (<div className={styles.facilityEventInfo}>
        <div className={styles.event_info__header}>
            이벤트 정보
        </div>
        <div className={styles.event_info__body}>
            <div className={styles.text_field}>
                <label htmlFor="start-date">이벤트명</label>
                <input type="text" maxLength={50} value={eventName} onChange={(e) => { setEventName(e.target.value); facilityEvent.setName(e.target.value); }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">예약자명</label>
                <input type="text" maxLength={50} value={hostName} onChange={(e) => { setHostName(e.target.value); facilityEvent.setHostName(e.target.value); }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">사용인원</label>
                <input type="text" maxLength={50} value={guestNumber} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^0-9]+/g, '');
                    setGuestNumber(validValue);
                    facilityEvent.setGuestNumber(parseInt(validValue));
                }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">사용용도</label>
                <input type="text" maxLength={50} value={purpose} onChange={(e) => { setPurpose(e.target.value); facilityEvent.setPurpose(e.target.value); }} />
            </div>
            <div className={styles.memo_field}>
                <label htmlFor="start-date">행사 개요</label>
                <textarea maxLength={1000} rows={4} value={outline} onChange={(e) => { setOutline(e.target.value); facilityEvent.setOutline(e.target.value); }} />
            </div>
            <div className={styles.buttons}>
                <button className={styles.submit} onClick={() => { setDoSubmitEvent(true); }}>{submitType === "register" && !selectedFacilitySchedule ? "이벤트 등록" : "이벤트 수정"}</button>
                <button className={styles.remove} onClick={() => { setDoRemoveEvent(true); }}>삭제하기</button>
            </div>
        </div>
    </div>);
}