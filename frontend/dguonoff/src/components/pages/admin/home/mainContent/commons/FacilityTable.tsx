import { useEffect, useRef } from "react";
import styles from "./FacilityTable.module.css";
import VirtualizedTable from "../../../../../../modules/virtualizedTable/VirtualizedTable";
import Facility from "../../../../../../types/Facility";
import useElementDimensions from "../../../../../../hooks/useElementDimensions";



export interface FacilityTableProps {
    facilities: Facility[];
    selectedFacility: Facility | null;
    setSelectedFacility: React.Dispatch<React.SetStateAction<Facility | null>>;
}


export default function FacilityTable({ facilities, selectedFacility, setSelectedFacility }: FacilityTableProps) {
    // Const
    const facilityTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "시설물명", style: { width: "75%" } },
        { name: "수용 인원", style: { width: "25%" } },
    ];


    // Ref
    const facilityTable = useRef<HTMLDivElement>(null);


    // Hook
    const [facilityTableWidth, facilityTableHeight] = useElementDimensions(facilityTable, "Pure");


    // Render
    return (<div className={styles.facilityTable} ref={facilityTable}>
        <VirtualizedTable
            windowHeight={facilityTableHeight - 4}
            tableStyles={{
                height: "calc(100% - 4px)",
                width: "calc(100% - 4px)",
                overflow: "hidden",
                borderRadius: "10px",
                border: "2px solid var(--component-main-color)"
            }}

            numColumns={facilityTableColumns.length}
            columnHeight={35}
            columnWidths={facilityTableColumns.map((column) => column.style)}
            columnStyles={{
                userSelect: "none",
                backgroundColor: "var(--component-main-light-color)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "17px",
                fontWeight: "600"
            }}
            renderColumns={({ index, columnClassName, columnStyle }) => {
                return (
                    <div key={index} className={columnClassName}
                        style={columnStyle}>
                        {facilityTableColumns[index].name}
                    </div>
                );
            }}

            numRows={facilities.length}
            rowHeight={45}
            rowStyles={{
                default: {
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                    backgroundColor: "var(--component-inner-color)"
                },
                hover: {
                    backgroundColor: "var(--component-main-light-color)"
                }
            }}
            renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                const facility = facilities[index];
                return (
                    <div key={index} id={`${index}`} className={rowClassName}
                        onClick={() => { setSelectedFacility(facility) }}
                        style={(selectedFacility && facility.getCode() === selectedFacility.getCode()) ? {
                            ...rowStyle,
                            color: 'var(--component-innertext-select-color)',
                            backgroundColor: 'var(--component-main-color)'
                        } : {
                            ...rowStyle
                        }}>
                        <div className={itemClassName} style={itemStyles[0]}>{facility.getName()}</div>
                        <div className={itemClassName} style={itemStyles[1]}>{facility.getCapacity()}</div>
                    </div>
                );
            }}
        />
    </div >);
}