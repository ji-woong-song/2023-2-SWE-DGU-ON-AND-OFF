import { useEffect, useState } from "react";
import styles from "./AdminHome.module.css";
import ReservationManager from "./mainContent/ReservationManager";
import Welcome from "./mainContent/Welcome";
import FixedTimetableManager from "./mainContent/FixedTimetableManager";
import IndividualTimetableManager from "./mainContent/IndividualTimetableManager";
import AdminAccountManager from "./mainContent/AdminAccountManager";


type SidebarMenu = "Blank" | "예약 신청 관리" | "고정 시간표 관리" | "개별 시간표 관리" | "관리자 계정 관리";


export default function AdminHome() {
    // Const
    const sidebarMenus: SidebarMenu[] = ["예약 신청 관리", "고정 시간표 관리", "개별 시간표 관리", "관리자 계정 관리"];


    // State
    const [currMenu, setCurrMenu] = useState<SidebarMenu>("관리자 계정 관리");
    const [hoverMenu, sethoverMenu] = useState<SidebarMenu>("관리자 계정 관리");


    // Handler
    const onSelectMenu = (menu: SidebarMenu) => {
        setCurrMenu(menu);
    }

    const onHoverMenu = (menu: SidebarMenu) => {
        sethoverMenu(menu);
    }

    const getContentComponent = () => {
        switch (currMenu) {
            case "Blank": {
                return <Welcome />;
            }
            case "예약 신청 관리": {
                return <ReservationManager />;
            }
            case "고정 시간표 관리": {
                return <FixedTimetableManager />;
            }
            case "개별 시간표 관리": {
                return <IndividualTimetableManager />;
            }
            case "관리자 계정 관리": {
                return <AdminAccountManager />
            }
            default: {
                return <></>;
            }
        }
    };


    // Effect
    useEffect(() => {

    }, []);


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
                    <div className={styles.sidebar__logout_text}>로그아웃</div>
                </div>
            </div>

            <div className={styles.mainContent}>
                {getContentComponent()}
            </div>
        </div >
    );
};