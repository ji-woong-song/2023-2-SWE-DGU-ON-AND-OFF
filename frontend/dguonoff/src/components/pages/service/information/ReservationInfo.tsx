import { useEffect, useState } from "react";
import { Box, Container, IconButton, Toolbar, Button, Grid } from "@mui/material";
import styles from "../Service.module.css";
import GrayBorderBox from "../../../../modules/GrayBorderBox";
import ReservationButton from "../../../../modules/reservationButton/ReservationButton";
import Reservation from "../../../../types/Reservation";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";
import { deleteReservation, modifyReservation } from "../../../../api/dguonandoff";
import { useNavigate } from 'react-router-dom';


interface ReservationInfoProps {
    reservation : Reservation;
  }

export default function ReservationInfo({reservation} : ReservationInfoProps) {
    const title : string = "예약 정보";
    const reservationInfo : Reservation = reservation;
    const [newOutline, setNewOutline] = useState<string>(reservation.getOutline());
    const navigate = useNavigate();

    const handleOutlineChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewOutline(event.target.value);
    }

    const handleOutlineSubmit = async () => {
        let userToken = CookieStorageProvider.get('authToken')!;
        let success = await modifyReservation(userToken,reservationInfo.getReservationId(), newOutline);
        if(success){
            alert("메모가 수정 되었습니다.");
        }
    }

    const handleCancel = async () => {
        let userToken = CookieStorageProvider.get('authToken')!;
        let success = await deleteReservation(userToken,reservationInfo.getReservationId());
        if(success){
            alert("예약이 취소되었습니다.");
            navigate(-1);
        }
    };

    return (
        <Container>
            <Box sx={{ height: '12px' }} />
            <Toolbar>
                <div className={styles.mainTitle}>
                    {title}
                </div>
            </Toolbar>
            <Container>
                <div className={styles.infoFacility}>
                    <div className={styles.usingFacilityTitle} > 
                            {reservationInfo.getBuildingName()}
                    </div>
                    <div className={styles.usingFacilityTitle}>
                        {reservationInfo.getFacilityName()} 
                    </div>
                </div>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5}}>
                    <Grid item className={styles.infoMenuTitle}>날짜</Grid>
                    <Grid item className={styles.infoMenuContent}>{reservationInfo.getDate()}</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5}}>
                    <Grid item className={styles.infoMenuTitle}>시간</Grid>
                    <Grid item className={styles.infoMenuContent}>{reservationInfo.getStartTime().slice(0,5)} ~ {reservationInfo.getEndTime().slice(0,5)}</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5 }}>
                    <Grid item className={styles.infoMenuTitle}>예약자</Grid>
                    <Grid item className={styles.infoMenuContent}>{reservationInfo.getHost().getName()}</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5 }}>
                    <Grid item className={styles.infoMenuTitle}>예약 인원</Grid>
                    <Grid item className={styles.infoMenuContent}>{reservation.getGuests.length}명</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 0 }}>
                    <Grid item className={styles.infoMenuTitle}>메모</Grid>
                </Grid>
                <GrayBorderBox style={{
                height : '124px'
                }}>
                    <textarea style={{
                        width: '100%', // 상위 컴포넌트의 너비와 동일하게 설정
                        height: '100%', // 상위 컴포넌트의 높이와 동일하게 설정
                        border: 'none', // 테두리 제거
                        resize: 'none', // 사용자가 크기 조절하는 것을 방지
                        outline : 'none'
                        }}
                className={styles.infoMenuContent} value={newOutline} onChange={handleOutlineChange} />
                </GrayBorderBox>    
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: '50px' }}>
                    <div style={{ flex: 1 }} onClick={handleOutlineSubmit}>
                        <button className={styles.loginButton}>메모 수정</button>
                    </div>
                    <div style={{ flex: 1 }} onClick={handleCancel}>
                        <button className={styles.loginButton}>예약 취소</button>
                    </div>
                </div>
            </Container>
        </Container>
    )
}