import styles from "./FacilityEventInfo.module.css";


export interface FacilityEventInfoProps {
    submitType: "register" | "modify";
}


export default function FacilityEventInfo({ submitType }: FacilityEventInfoProps) {
    return (<div className={styles.facilityEventInfo}>
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
                <button className={styles.submit}>{submitType === "register" ? "이벤트 등록" : "이벤트 수정"}</button>
                <button className={styles.remove}>삭제하기</button>
            </div>
        </div>
    </div>);
}