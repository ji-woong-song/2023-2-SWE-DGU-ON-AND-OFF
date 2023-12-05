import { useEffect, useState } from "react";
import styles from "./AdminHome.module.css";
import ReservationManager from "./mainContent/ReservationManager";
import Welcome from "./mainContent/Welcome";
import FixedTimetableManager from "./mainContent/FixedTimetableManager";
import IndividualTimetableManager from "./mainContent/IndividualTimetableManager";
import AdminAccountManager from "./mainContent/AdminAccountManager";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getBuildings, getUserRole, requestAuthLogout } from "../../../../api/dguonandoff";
import Building from "../../../../types/Building";
import AnnouncementManager from "./mainContent/AnnouncementManager";


type SidebarMenu = "Blank" | "예약 신청 관리" | "고정 시간표 관리" | "개별 시간표 관리" | "관리자 계정 관리" | "공지사항 등록";


export default function AdminHome() {
    // Const
    const navigate = useNavigate();


    // State
    const [sidebarMenus, setSidebarMenus] = useState<SidebarMenu[]>(["예약 신청 관리", "고정 시간표 관리", "개별 시간표 관리", "공지사항 등록"]);
    const [currMenu, setCurrMenu] = useState<SidebarMenu>("Blank");
    const [hoverMenu, sethoverMenu] = useState<SidebarMenu>("Blank");
    const [buildings, setBuildings] = useState<Building[]>([]);


    // Handler
    const onSelectMenu = (menu: SidebarMenu) => {
        setCurrMenu(menu);
    }

    const onHoverMenu = (menu: SidebarMenu) => {
        sethoverMenu(menu);
    }

    const onLogoutClick = () => {
        requestAuthLogout();
        navigate('/admin/login');
    };

    const getContentComponent = () => {
        switch (currMenu) {
            case "Blank": {
                return <Welcome />;
            }
            case "예약 신청 관리": {
                return <ReservationManager buildings={buildings} />;
            }
            case "고정 시간표 관리": {
                return <FixedTimetableManager buildings={buildings} />;
            }
            case "개별 시간표 관리": {
                return <IndividualTimetableManager buildings={buildings} />;
            }
            case "관리자 계정 관리": {
                return <AdminAccountManager />
            }
            case "공지사항 등록": {
                return <AnnouncementManager />
            }
            default: {
                return <></>;
            }
        }
    };


    // Effect
    useEffect(() => {
        (async () => {
            const [token, userRole] = [getAuthToken(), getUserRole()];
            if (token && userRole) {
                if (userRole === "MASTER") {
                    setSidebarMenus(["예약 신청 관리", "고정 시간표 관리", "개별 시간표 관리", "공지사항 등록", "관리자 계정 관리"]);
                }
                setBuildings(await getBuildings(token));
            } else {
                alert("로그인 시간이 만료되었습니다.");
                navigate("/admin/login")
            }
        })();
    }, [navigate]);


    // Render
    return (
        <div className={styles.adminHome}>
            <div className={styles.sidebar}>
                <div className={styles.sidebar__menus}>
                    {sidebarMenus.map((menu, index) => (
                        <div key={index}
                            className={styles.sidebar__menu}
                            onClick={() => onSelectMenu(menu)}
                            onMouseOver={() => onHoverMenu(menu)}
                            onMouseLeave={() => onHoverMenu("Blank")}>
                            <div className={styles.sidebar__menu_focus}
                                style={{ visibility: currMenu === menu || hoverMenu === menu ? 'visible' : 'hidden' }}></div>
                            <div className={styles.sidebar__menu_text}
                                style={{
                                    color: currMenu === menu || hoverMenu === menu ?
                                        ' var(--component-innertext-select-color)' : ' var(--component-innertext-color)'
                                }}>{menu}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.sidebar__logout}>
                    <div className={styles.sidebar__logout_text} onClick={onLogoutClick}>로그아웃</div>
                </div>
            </div>

            <div className={styles.mainContent}>
                {getContentComponent()}
            </div>
        </div >
    );
};