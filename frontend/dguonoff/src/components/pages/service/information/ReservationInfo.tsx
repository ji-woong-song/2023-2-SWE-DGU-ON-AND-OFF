import { useEffect, useState } from "react";
import { Box, Container, IconButton, Toolbar, Button, Grid } from "@mui/material";
import styles from "../Service.module.css";
import GrayBorderBox from "../../../../modules/GrayBorderBox";
import ReservationButton from "../../../../modules/reservationButton/ReservationButton";

export default function ReservationInfo() {
    const title : string = "예약 정보";

    const onTapCancel = () => {
        console.log("cancel clicked");
    };

    return (
        <Container>
            <Toolbar>
                <div className={styles.mainTitle}>
                    {title}
                </div>
            </Toolbar>
            <Container>
                <div className={styles.infoFacility}>
                    <div className={styles.usingFacilityTitle} > 
                            신공학관(기숙사)
                    </div>
                    <div className={styles.usingFacilityTitle}>
                        401-3107(3107 강의실) 
                    </div>
                </div>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5}}>
                    <Grid item className={styles.infoMenuTitle}>날짜</Grid>
                    <Grid item className={styles.infoMenuContent}>2019.10.07(금)</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5}}>
                    <Grid item className={styles.infoMenuTitle}>시간</Grid>
                    <Grid item className={styles.infoMenuContent}>14:00 ~ 16:00</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5 }}>
                    <Grid item className={styles.infoMenuTitle}>예약자</Grid>
                    <Grid item className={styles.infoMenuContent}>남선우</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 1.5 }}>
                    <Grid item className={styles.infoMenuTitle}>예약 인원</Grid>
                    <Grid item className={styles.infoMenuContent}>2명</Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ pt: 1.5, pb: 0 }}>
                    <Grid item className={styles.infoMenuTitle}>메모</Grid>
                </Grid>
                <GrayBorderBox style={{
                height : '124px'
                }}>
                    <div className={styles.infoMenuContent}>이것은 메모입니다.</div>
                </GrayBorderBox>    
                <ReservationButton onClick={onTapCancel} buttonTitle="예약 취소"/>
            </Container>
        </Container>
    )
}