import { useEffect, useState } from "react";
import { Box, Container, IconButton, Toolbar, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from "./MainPage.module.css";
import GrayBorderBox from "../../../../modules/GrayBorderBox";
import GrayCircle from "../../../../modules/GrayCircle";
import { Business, LocalLibrary, FilterHdr } from '@mui/icons-material';


interface FacilityMenu {
    name : string,
    icon : React.ReactElement,
}


export default function MainPage() {
    const appName : string = "동국 ON/OFF";

    const facilityMenu : FacilityMenu[] = [
        {
            name : "강의실",
            icon : <Business sx={{ color: 'red' }}/>
        },
        {
            name : "중앙도서관",
            icon : <LocalLibrary sx={{ color: 'yellow' }}/>
        },
        {
            name : "만해광장",
            icon : <FilterHdr sx={{ color: 'green' }}/>
        },
    ]

    const handleBellClick = () => {
        console.log("bell clicked");
    }

    return (
        <Container>
            <Toolbar>
                <div className={styles.mainTitle}>
                    {appName}
                </div>
                <IconButton onClick={handleBellClick}>
                    <NotificationsIcon/>
                </IconButton>
            </Toolbar>

            <GrayBorderBox style={{
                display: 'flex', // Flexbox 레이아웃 사용
                flexDirection: 'column', // 요소들을 세로 방향으로 정렬
                justifyContent: 'center', // 세로축에서 중앙 정렬
                paddingTop: '32px', 
                paddingBottom: '32px',
            }}>
                {/* 상자 안의 내용 */}
                <div className={styles.usingFacilityTitle} > 
                    신공학관(기숙사)
                </div>
                <div className={styles.usingFacilityTitle}>
                    401-3107(3107 강의실) 
                </div>
                <div style={{ height: '12px' }} />
                <div className={styles.usingTime}>
                    14:00 ~ 15:00 이용중
                </div>
                <div style={{ height: '12px' }} />
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant="contained"
                    style={{ backgroundColor: '#EDEBE7', color: '#959494', fontWeight : 'bold', boxShadow: 'none' }}
                    >이용 종료</Button>
                </div>        
            </GrayBorderBox>

            <Box sx={{ display: 'flex', gap: 2 }} >
                {
                    facilityMenu.map((menu, index) => (
                        <div className={styles.menuContainer}>
                            <GrayCircle key={index} radius={23} icon = {menu.icon} />
                            <div className={styles.menuTitle}>{menu.name}</div>
                        </div>
                    ))
                }
            </Box>
            
            <GrayBorderBox style={{
                height : '180px'
            }}>
                <div className={styles.boxTitle}>
                    즐겨찾기
                </div>
            </GrayBorderBox>
            <GrayBorderBox style={{
                height : '180px'
            }}>
                <div className={styles.boxTitle}>
                    내 예약
                </div>
            </GrayBorderBox>
        </Container>
    );
}