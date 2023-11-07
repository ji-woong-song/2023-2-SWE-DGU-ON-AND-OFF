import { useEffect, useState } from "react";



/*****************************************************************
 * HTML 요소의 dimensions (width와 height)를 관리하는 React Hook입니다.
 *****************************************************************/

/** HTML 요소의 dimensions (width와 height) 인터페이스 */
interface HtmlElementDimensions {
    width: number;
    height: number;
}


/**
 * useElementDimensions Hook은 HTML 요소의 dimensions (width와 height)를 반환합니다.
 *
 * 이 Hook은 "Default" 또는 "Pure" dimension type을 받아, 
 * 각각 padding과 border를 포함하거나 포함하지 않는 dimensions을 반환합니다.
 *
 * @param {React.RefObject<T>} htmlElement - dimensions을 가져올 HTML 요소의 참조입니다.
 * @param {"Default" | "Pure"} dimensionType - dimensions 타입입니다. 
 *        "Default"는 padding과 border를 포함, "Pure"는 padding과 border를 제외합니다.
 * @returns {[number, number]} HTML 요소의 width와 height를 반환합니다.
 */
export default function useElementDimensions<T extends HTMLElement>(
    htmlElement: React.RefObject<T>,
    dimensionType: "Default" | "Pure"
): [number, number] {
    const [dimensions, setDimensions] = useState<HtmlElementDimensions>({ width: 0, height: 0 });
    const getDimensions = dimensionType === "Default" ? getDefaultDimensions : getPureDimensions;

    useEffect(() => {
        const currentElement = htmlElement.current;
        let frameId: number | null = null;

        const observerCallback = () => {
            const newDimensions: HtmlElementDimensions = getDimensions(htmlElement);

            if (
                dimensions.width !== newDimensions.width ||
                dimensions.height !== newDimensions.height
            ) {
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
                frameId = requestAnimationFrame(() => {
                    setDimensions(newDimensions);
                });
            }
        };

        const observer = new ResizeObserver(observerCallback);

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [dimensions, getDimensions, htmlElement]);

    return [dimensions.width, dimensions.height];
}

/**
 * getDefaultDimensions 함수는 요소의 dimensions을 가져옵니다. 
 * 이 dimensions은 padding과 border를 포함합니다.
 *
 * @param {React.RefObject<HTMLElement>} htmlElement - dimensions을 가져올 HTML 요소의 참조입니다.
 * @returns {HtmlElementDimensions} HTML 요소의 dimensions을 반환합니다.
 */
function getDefaultDimensions(htmlElement: React.RefObject<HTMLElement>): HtmlElementDimensions {
    if (htmlElement.current) {
        return {
            width: htmlElement.current.getBoundingClientRect().width || 0,
            height: htmlElement.current.getBoundingClientRect().height || 0,
        };
    }
    return { width: 0, height: 0 };
}

/**
 * getPureDimensions 함수는 요소의 순수 dimensions만을 가져옵니다.
 * 이 dimensions은 padding과 border를 제외합니다.
 *
 * @param {React.RefObject<HTMLElement>} htmlElement - dimensions을 가져올 HTML 요소의 참조입니다.
 * @returns {HtmlElementDimensions} HTML 요소의 dimensions을 반환합니다.
 */
function getPureDimensions(htmlElement: React.RefObject<HTMLElement>): HtmlElementDimensions {
    if (htmlElement.current) {
        const styles = window.getComputedStyle(htmlElement.current);

        const width = htmlElement.current.getBoundingClientRect().width || 0;
        const height = htmlElement.current.getBoundingClientRect().height || 0;

        const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

        const borderX = parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth);
        const borderY = parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);

        return {
            width: width - (paddingX + borderX),
            height: height - (paddingY + borderY),
        };
    }
    return { width: 0, height: 0 };
}