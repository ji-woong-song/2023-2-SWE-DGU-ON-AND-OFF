import { useState } from "react";
import styles from "./FacilityCategoryTable.module.css"



export type FacilityCategory = "Blank" | "강의실" | "도서관 세미나실" | "운동장" | "만해광장" | "강당";


export interface FacilityCategoryTableProps {
    currFacility: FacilityCategory;
    setCurrFacility: React.Dispatch<React.SetStateAction<FacilityCategory>>;
}


export default function FacilityCategoryTable({ currFacility, setCurrFacility }: FacilityCategoryTableProps) {
    // Const
    const facilities: FacilityCategory[] = ["강의실", "도서관 세미나실", "운동장", "만해광장", "강당"];


    // State
    const [hoverFacility, sethoverFacility] = useState<FacilityCategory>("Blank");


    // Handler
    const onSelectFacility = (category: FacilityCategory) => {
        setCurrFacility(category);
    }

    const onHoverFacility = (category: FacilityCategory) => {
        sethoverFacility(category);
    }


    // Render
    return (<div className={styles.facilityCategory}>
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
    </div>);
}