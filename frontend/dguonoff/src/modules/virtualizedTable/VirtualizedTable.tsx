import React, { useState, useCallback } from 'react';
import styles from "./VirtualizedTable.module.css"

/*****************************************************************
 * 가상 스크롤링을 지원하는 테이블 컴포넌트입니다.
 *****************************************************************/

/** VirtualizedTable의 속성 인터페이스 */
export interface VirtualizedTableProps {
    windowHeight: number;  // 윈도우 높이
    tableStyles?: React.CSSProperties;  // 테이블 스타일
    hideScrollbar?: boolean;  // 스크롤바 숨김 여부

    numColumns: number;  // 열의 개수
    columnHeight: number;  // 열 높이
    columnWidths: React.CSSProperties[];  // 각 열의 너비
    columnStyles?: React.CSSProperties;  // 열 스타일
    renderColumns: (item: { index: number; columnClassName: string; columnStyle: React.CSSProperties; }) => JSX.Element;  // 열 렌더링 함수

    numRows: number;  // 행의 개수
    rowHeight: number;  // 행 높이
    rowStyles?: { default?: React.CSSProperties, hover?: React.CSSProperties };  // 행 스타일
    renderRows: (item: { index: number; rowClassName: string; rowStyle: React.CSSProperties, itemClassName: string; itemStyles: React.CSSProperties[]; }) => JSX.Element;  // 행 렌더링 함수
}

/**
 * VirtualizedTable 함수 컴포넌트는 가상 스크롤링을 지원하는 테이블을 렌더링합니다.
 * 
 * 이 컴포넌트는 주어진 window 높이와 열/행의 속성에 따라 테이블을 구성하며,
 * 스크롤 위치에 따라 현재 보이는 행만 렌더링하여 성능을 최적화합니다.
 *
 * @param {VirtualizedTableProps} props - VirtualizedTable의 속성입니다.
 * @returns {JSX.Element} 렌더링된 가상 스크롤 테이블입니다.
 */
export default function VirtualizedTable({
    windowHeight, tableStyles, hideScrollbar,
    numColumns, columnHeight, columnWidths, columnStyles, renderColumns,
    numRows, rowHeight, rowStyles, renderRows,
}: VirtualizedTableProps): JSX.Element {
    const [scrollTop, setScrollTop] = useState(0);  // 현재 스크롤 위치

    // 테이블의 각 부분 높이 계산
    const innerHeight = numRows * rowHeight;  // 테이블 본체 높이
    const headerHeight = columnHeight;  // 헤더 높이
    const bodyHeight = windowHeight - columnHeight;  // 테이블 본체가 차지하는 높이

    // 현재 보이는 행의 범위 계산
    const startIndex = Math.floor(scrollTop / rowHeight);  // 시작 인덱스
    const endIndex = Math.min(numRows - 1, Math.floor((scrollTop + bodyHeight) / rowHeight));  // 종료 인덱스

    // 마우스 오버된 행 추적
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    // 스크롤 이벤트 핸들러
    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);  // 스크롤 위치 업데이트
    }, []);

    // 열 렌더링
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
        columns.push(
            React.cloneElement(renderColumns({
                index: i,
                columnClassName: `${styles.virtualizedTable_column}`,
                columnStyle: {
                    flex: `0 0 ${columnWidths?.length ? columnWidths[i].width : "100px"}`,
                    height: `${columnHeight}px`,
                    textAlign: "center",
                    ...columnStyles,
                }
            }), { key: `column-${i}` })
        );
    }

    // 행 렌더링
    const rows = [];
    for (let i = startIndex; i <= endIndex; i++) {
        rows.push(
            React.cloneElement(renderRows({
                index: i,
                rowClassName: `${styles.virtualizedTable_row}`,
                rowStyle: {
                    display: "flex",
                    position: "absolute",
                    top: `${i * rowHeight}px`,
                    width: "100%",
                    height: `${rowHeight}px`,
                    ...rowStyles?.default,
                    ...(i === hoveredRow && rowStyles?.hover),
                },
                itemClassName: `${styles.virtualizedTable_item}`,
                itemStyles: columnWidths.map((column) => ({
                    flex: `0 0 ${column.width}`,
                    height: `100%`,
                    textAlign: "center",
                    overflowX: "hidden",
                    overflowY: "auto",
                }))
            }), {
                key: `row-${i}`,
                onMouseEnter: () => setHoveredRow(i),
                onMouseLeave: () => setHoveredRow(null)
            })
        );
    }

    // 가상 스크롤 테이블 렌더링
    return (
        <div className={styles.virtualizedTable} style={tableStyles}>
            <div className={styles.table__header}
                style={{
                    height: `${headerHeight}px`,
                    maxHeight: `${headerHeight}px`,
                    width: `${hideScrollbar ? "100%" : "calc(100% - 17px)"}`,
                    marginRight: `${hideScrollbar ? "none" : "17px solid"}`,
                    borderRightColor: `${(columnStyles?.backgroundColor as string)?.split(' ').pop()}`
                }}>
                <div className={styles.table__headers_columns}>
                    {columns}
                </div>
            </div>

            <div className={styles.table__body}
                style={{
                    height: `${bodyHeight}px`,
                    maxHeight: `${bodyHeight}px`,
                    overflowY: `${hideScrollbar ? "hidden" : "scroll"}`
                }}
                onScroll={onScroll}>
                <div className={styles.table__body_rows} style={{ height: `${innerHeight}px` }}>
                    {rows}
                </div>
            </div>
        </div>
    );
};
