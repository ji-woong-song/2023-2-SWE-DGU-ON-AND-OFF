import { useEffect, useState } from "react";
import styles from "./AdminHome.module.css";
import ReservationManager from "./mainContent/ReservationManager";
import Welcome from "./mainContent/Welcome";
import FixedTimetableManager from "./mainContent/FixedTimetableManager";


type SidebarMenu = "Blank" | "예약 신청 관리" | "고정 시간표 관리" | "개별 시간표 관리";
type Facility = "Blank" | "강의실" | "도서관 세미나실" | "운동장" | "만해광장" | "강당";


export default function AdminHome() {
    // Const
    const sidebarMenus: SidebarMenu[] = ["예약 신청 관리", "고정 시간표 관리", "개별 시간표 관리"];
    const facilities: Facility[] = ["강의실", "도서관 세미나실", "운동장", "만해광장", "강당"];


    // State
    const [currMenu, setCurrMenu] = useState<SidebarMenu>("고정 시간표 관리");
    const [hoverMenu, sethoverMenu] = useState<SidebarMenu>("고정 시간표 관리");
    const [currFacility, setCurrFacility] = useState<Facility>("Blank");
    const [hoverFacility, sethoverFacility] = useState<Facility>("Blank");


    // Handler
    const onSelectMenu = (menu: SidebarMenu) => {
        setCurrMenu(menu);
    }

    const onHoverMenu = (menu: SidebarMenu) => {
        sethoverMenu(menu);
    }

    const onSelectFacility = (facility: Facility) => {
        setCurrFacility(facility);
    }

    const onHoverFacility = (facility: Facility) => {
        sethoverFacility(facility);
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
                <div className={styles.main_top}>
                    {(currMenu !== "Blank") &&
                        <table className={styles.facility_select}>
                            <tbody >
                                <tr >
                                    {facilities.map((facility, index) => (
                                        <td key={index}
                                            className={styles.facility}
                                            onClick={() => onSelectFacility(facility)}
                                            onMouseOver={() => onHoverFacility(facility)}
                                            onMouseLeave={() => onHoverFacility("Blank")}
                                            style={{
                                                color: currFacility === facility || hoverFacility === facility ?
                                                    'var(--component-innertext-select-color)' : 'var(--component-innertext-color)',
                                                backgroundColor: currFacility === facility || hoverFacility === facility ?
                                                    'var(--component-main-color)' : 'var(--component-inner-color)',
                                            }}>
                                            {facility}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
                <div className={styles.main_mid}>
                    {getContentComponent()}
                </div>
            </div>
        </div >
    );
};