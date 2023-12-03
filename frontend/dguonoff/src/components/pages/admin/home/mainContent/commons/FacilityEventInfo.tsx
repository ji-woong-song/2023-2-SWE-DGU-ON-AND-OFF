import styles from "./FacilityEventInfo.module.css";

export type FacilityEvent = {
    name: string;
    hostName: string;
    outline: string;
    purpose: string;
    guestNumber: number;
}


export interface FacilityEventInfoProps {
    submitType: "register" | "modify";
    facilityEvent: FacilityEvent;
    setFacilityEvent: React.Dispatch<React.SetStateAction<FacilityEvent>>;
    setDoSubmitEvent: React.Dispatch<React.SetStateAction<boolean>>;
    setDoRemoveEvent: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function FacilityEventInfo({ submitType, facilityEvent, setFacilityEvent, setDoSubmitEvent, setDoRemoveEvent }: FacilityEventInfoProps) {
    // Render
    return (<div className={styles.facilityEventInfo}>
        <div className={styles.event_info__header}>
            이벤트 정보
        </div>
        <div className={styles.event_info__body}>
            <div className={styles.text_field}>
                <label htmlFor="start-date">이벤트명</label>
                <input type="text" maxLength={50} onChange={(e) => { setFacilityEvent({ ...facilityEvent, name: e.target.value }); }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">예약자명</label>
                <input type="text" maxLength={50} onChange={(e) => { setFacilityEvent({ ...facilityEvent, hostName: e.target.value }); }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">사용인원</label>
                <input type="text" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^0-9]+/g, '');
                    e.target.value = validValue;
                    setFacilityEvent({ ...facilityEvent, guestNumber: parseInt(validValue) });
                }} />
            </div>
            <div className={styles.text_field}>
                <label htmlFor="start-date">사용용도</label>
                <input type="text" maxLength={50} onChange={(e) => { setFacilityEvent({ ...facilityEvent, purpose: e.target.value }); }} />
            </div>
            <div className={styles.memo_field}>
                <label htmlFor="start-date">행사 개요</label>
                <textarea maxLength={1000} rows={4} onChange={(e) => { setFacilityEvent({ ...facilityEvent, outline: e.target.value }); }} />
            </div>
            <div className={styles.buttons}>
                <button className={styles.submit} onClick={() => { setDoSubmitEvent(true); }}>{submitType === "register" ? "이벤트 등록" : "이벤트 수정"}</button>
                <button className={styles.remove} onClick={() => { setDoRemoveEvent(true); }}>삭제하기</button>
            </div>
        </div>
    </div>);
}