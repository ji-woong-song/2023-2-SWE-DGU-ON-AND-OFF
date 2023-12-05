import { useContext, useEffect, useState } from "react";
import { Box, Container, IconButton, Toolbar, Button } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from "../Service.module.css";
import GrayBorderBox from "../../../../modules/GrayBorderBox";
import GrayCircle from "../../../../modules/GrayCircle";
import { Business, LocalLibrary, FilterHdr, BlindsClosedSharp } from '@mui/icons-material';
import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import Bookmark from "../../../../types/Bookmark";
import { finishFacilityUsing, getBuildings, getMyBookmark, getMyReservations } from "../../../../api/dguonandoff";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";
import { useModal } from "../../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../../modules/modal/ModalAnimations";
import Building from "../../../../types/Building";
import Reservation from "../../../../types/Reservation";
import { ReservationContext } from "../../../../App";


interface FacilityMenu {
    name : string,
    icon : React.ReactElement,
}


export default function MainPage() {
    const navigate = useNavigate();
    const isUserLoggedIn = useAuth();
    const [myBookmarks, setMyBookmarks] = useState<Bookmark[]>([]); // 즐겨찾기 목록
    const [myReservations, setMyReservations] = useState<Reservation[]>([]); // 내 예약 목록
    const [buildings, setBuildings] = useState<Building[]>([]); // 시설 목록
    const [isActive, setIsActive] = useState<boolean>(false);
    const [nowUsingReservation, setNowUsingReservation] = useState<Reservation>(); // 현재 이용중인 예약
    const [FacilityMenuModal, openFacilityMenuModal, closeFacilityMenuModal] = useModal(ModalAnimationType.ZOOM);
    const {setReservationInfo } = useContext(ReservationContext);
    
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
            userToken = CookieStorageProvider.get('userAuthToken')!;
            handleLoadBookmark();
            handleLoadReservation();
            handleLoadBuildings();
        }
      }, [isUserLoggedIn, navigate]);


    const handleLoadBookmark = async () => {
        const bookmarks : Bookmark[] = await getMyBookmark(userToken);
        setMyBookmarks(bookmarks);
    }

    const handleLoadReservation = async () => {
        const reservations : Reservation[] = await getMyReservations(userToken);
        setMyReservations(reservations);

        let { isActiveNow, ActiveReservation } = findActiveReservation(reservations);
            setIsActive(isActiveNow);

        if(isActiveNow){
            setNowUsingReservation(ActiveReservation!);
        }
    }

    const handleBellClick = () => {
        navigate('/announcement');
    }

    const handleMenuClick = async () => {
        openFacilityMenuModal();
    }

    const handleLoadBuildings = async () => {
        const buildings : Building[] = await getBuildings(userToken);
        setBuildings(buildings);
    }

    const handleOnClickMyResrvation = (reservation : Reservation) => {
        setReservationInfo(reservation);
        navigate('/reservationInfo');
    }

    const handleEndUsing = async () => {
        const userConfirmed = window.confirm("이용을 종료하시겠습니까?");

        if(!userConfirmed) return;
        
        let success = await finishFacilityUsing(userToken, nowUsingReservation!.getBuildingName(), nowUsingReservation!.getFacilityName());
        if(success){
            alert("이용이 종료되었습니다.");
            setIsActive(false);
            setNowUsingReservation(undefined);
        }
    }

    const findActiveReservation = (reservationList: Reservation[]): { isActiveNow: boolean, ActiveReservation: Reservation | null } => {
        const now = new Date();
      
        for (const reservation of reservationList) {
          const startDate = new Date(`${reservation.getDate()}T${reservation.getStartTime()}`);
          const endDate = new Date(`${reservation.getDate()}T${reservation.getEndTime()}`);
      
          if (now >= startDate && now <= endDate && reservation.getFacilityState() === "USING") {
            return { isActiveNow: true, ActiveReservation :reservation };
          }
        }
      
        return { isActiveNow: false, ActiveReservation: null };
    };

    return (
            <Container>
            <Box sx={{ height: '12px' }} />
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
                {
                    isActive ? 
                    <div>
                        {/* 상자 안의 내용 */}
                        <div className={styles.usingFacilityTitle} > 
                            {nowUsingReservation!.getBuildingName()}
                        </div>
                        <div className={styles.usingFacilityTitle}>
                            {nowUsingReservation!.getFacilityName()}
                        </div>
                        <div style={{ height: '12px' }} />
                        <div className={styles.usingTime}>
                            {nowUsingReservation!.getStartTime().slice(0,5)} ~ {nowUsingReservation!.getEndTime().slice(0,5)} 이용중
                        </div>
                        <div style={{ height: '12px' }} />
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <Button 
                            variant="contained"
                            style={{ backgroundColor: '#EDEBE7', color: '#959494', fontWeight : 'bold', boxShadow: 'none' }}
                            onClick={handleEndUsing}
                            >이용 종료</Button>
                        </div>  
                    </div> :
                    <div className={styles.noUsingFacility}>
                        <BlindsClosedSharp sx={{ color: '#959494', fontSize: '56px' }}/>
                        <div className={styles.noUsingText}>
                            현재 이용중인 시설물이 없어요.
                        </div>
                    </div>
                }     
            </GrayBorderBox>

            <Box sx={{ display: 'flex', gap: 2 }} >
                {
                    facilityMenu.map((menu, index) => (
                        <div className={styles.menuContainer} onClick={handleMenuClick}>
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
                        <div key={index} >
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                <Business sx={{ color: '#959494', paddingTop : '12px' }}/>
                                <div style={{ paddingTop: '12px' }}>{bookmark.getBuildingName()}</div>
                                <div style={{ paddingTop: '12px' }}>{bookmark.getFacilityName()}</div>
                            </div>
                        </div>
                    ))}
                    </> : 
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>즐겨찾기가 없어요.</div>}
               
            </GrayBorderBox>
            <GrayBorderBox>
                <div className={styles.boxTitle}>
                    내 예약
                </div>
                <Box sx={{ height : '4px' }}/>
                {myReservations.length > 0 ? 
                    <>
                     {myReservations.map((reservation, index) => (
                        <div key={index} onClick={() => handleOnClickMyResrvation(reservation)}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                <Business sx={{ color: '#959494', paddingTop : '12px' }}/>
                                <div>
                                    <div style={{ paddingTop: '12px', fontSize : '10px' }}>{reservation.getDate()}</div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                                        <div style={{ paddingTop: '0px' }}>{reservation.getBuildingName()}</div>
                                        <div style={{ paddingTop: '0px' }}>{reservation.getFacilityName()}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                    </> : 
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>예약내역이 없어요.</div>}
            </GrayBorderBox>
            <FacilityMenuModal>
                <table>
                    <tbody>
                        <div className={styles.modalContent}>
                            {buildings.map((building, index) => (
                                <tr>
                                    <div key={index}>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                            <Business sx={{ color: '#959494', paddingTop : '12px' }}/>
                                            <div>
                                                <div style={{ paddingTop: '12px', fontSize : '10px' }}>{building.getName()}</div>
                                            </div>

                                        </div>
                                    </div>
                                </tr>  
                            ))}
                        </div>x
                    </tbody>
                </table>
            </FacilityMenuModal>
        </Container>
    );
}