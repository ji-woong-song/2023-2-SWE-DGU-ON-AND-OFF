import React, { useEffect, useRef } from "react";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import styles from "./SelectBuildingFloor.module.css"
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import { SelectedBuildingContext } from "../../../../../App";

interface SelectFacilityFloorProps {
    floor: number;
    setFloor: React.Dispatch<React.SetStateAction<number>>;
}

export default function SelectBuildingFloor({ floor, setFloor }: SelectFacilityFloorProps) {
    // Const
    const floorTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "층", style: { width: "100%" } },
    ];


    // Ref
    const floorTable = useRef<HTMLDivElement>(null);


    // Hook
    const floorTableHeight = useElementDimensions(floorTable, "Pure")[1];


    // Context
    const selectedBuilding = React.useContext(SelectedBuildingContext).selectedBuilding;


    // Render
    return (<div className={styles.SelectFacilityFloor}>
        <div className={styles.floorTable} ref={floorTable}>
            <VirtualizedTable
                windowHeight={floorTableHeight - 4}
                tableStyles={{
                    height: "calc(100% - 4px)",
                    width: "calc(100% - 4px)",
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "2px solid var(--component-main-color)"
                }}

                numColumns={floorTableColumns.length}
                columnHeight={40}
                columnWidths={floorTableColumns.map((column) => column.style)}
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
                            {floorTableColumns[index].name}
                        </div>
                    );
                }}

                numRows={selectedBuilding ? selectedBuilding.getMaxFloor() : 0}
                rowHeight={50}
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
                    return (
                        <div key={index} id={`${index}`} className={rowClassName}
                            onClick={() => { setFloor(index + 1) }}
                            style={floor === index + 1 ? ({
                                ...rowStyle,
                                color: 'var(--component-innertext-select-color)',
                                backgroundColor: 'var(--component-main-color)'
                            }) : ({
                                ...rowStyle
                            })}>
                            <div className={itemClassName} style={itemStyles[0]}>{index + 1}</div>
                        </div>
                    );
                }}
            />
        </div>
    </div >);
}