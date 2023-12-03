import { useEffect, useState } from "react";
import { Box, Container, IconButton, Toolbar, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from "../Service.module.css";
import GrayBorderBox from "../../../../modules/GrayBorderBox";
import GrayCircle from "../../../../modules/GrayCircle";
import { Business, LocalLibrary, FilterHdr } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import Bookmark from "../../../../types/Bookmark";
import { getMyBookmark } from "../../../../api/dguonandoff";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";


interface FacilityMenu {
    name : string,
    icon : React.ReactElement,
}


export default function MainPage() {
    const navigate = useNavigate();
    const isUserLoggedIn = useAuth();
    const [myBookmarks, setMyBookmarks] = useState<Bookmark[]>([]); // 즐겨찾기 목록
    let userToken : string = "";

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

    useEffect(() => {
        console.log('isUserLoggedIn:', isUserLoggedIn)
        if (!isUserLoggedIn) {
          navigate('/login'); // 로그인 안되어 있으면 로그인 페이지로 이동
        }else{
            userToken = CookieStorageProvider.get('userAuthToken') || "";
            handleLoadBookmark();
        }
      }, [isUserLoggedIn, navigate]);


    const handleLoadBookmark = async () => {
        const bookmarks : Bookmark[] = await getMyBookmark(userToken);
        setMyBookmarks(bookmarks);
    }

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
            
            <GrayBorderBox>
                <div className={styles.boxTitle}>
                    즐겨찾기
                </div> 
                <Box sx={{ height : '4px' }}/>
                {myBookmarks.length > 0 ? 
                    <>
                     {myBookmarks.map((bookmark, index) => (
                        <div key={index}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                <Business sx={{ color: '#959494', paddingTop : '12px' }}/>
                                <div style={{ paddingTop: '12px' }}>{bookmark.getBuildingName()}</div>
                                <div style={{ paddingTop: '12px' }}>{bookmark.getFacilityName()}</div>
                            </div>
                        </div>
                    ))}
                    </> : 
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>즐겨찾기가 없습니다.</div>}
               
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