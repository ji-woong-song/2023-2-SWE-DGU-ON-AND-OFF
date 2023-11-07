import { useCallback, useRef } from 'react';



/*****************************************************************
 * 모바일 및 데스크톱 환경에서 단일 탭과 더블 탭 이벤트를 처리하는 React Hook입니다.
 *****************************************************************/


/**
 * useTapEvents Hook은 단일 탭과 더블 탭 이벤트를 처리하며, 
 * 각각의 이벤트에 대한 콜백 함수를 제공합니다.
 *
 * 이 Hook은 단일 탭 이벤트가 발생하면 onSingleTouch 콜백을 호출하고, 
 * 더블 탭 이벤트가 발생하면 onDoubleTouch 콜백을 호출합니다.
 *
 * @param {Object} param0 - Hook의 옵션 객체입니다.
 * @param {Function} param0.onSingleTouch - 단일 탭 이벤트에 대한 콜백 함수입니다.
 * @param {Function} param0.onDoubleTouch - 더블 탭 이벤트에 대한 콜백 함수입니다.
 * @param {number} delay - 더블 탭 감지를 위한 지연 시간입니다. 기본값은 300ms입니다.
 * @returns {Function} 이벤트 핸들러 함수를 반환합니다. 이 함수는 단일 및 더블 탭 이벤트를 처리합니다.
 */
export default function useTapEvents(
    { onSingleTouch, onDoubleTouch }: { onSingleTouch?: () => void, onDoubleTouch?: () => void },
    delay: number = 300
) {
    const tapRef = useRef<number>(0);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTap = useCallback(() => {
        const now = Date.now();
        if (now - tapRef.current < delay) {
            if (touchTimer.current) {
                clearTimeout(touchTimer.current);
                touchTimer.current = null;
            }
            if (onDoubleTouch) {
                onDoubleTouch();
            }
            tapRef.current = 0;
        } else {
            tapRef.current = now;
            touchTimer.current = setTimeout(() => {
                if (onSingleTouch) {
                    onSingleTouch();
                }
            }, delay);
        }
    }, [onDoubleTouch, onSingleTouch, delay]);

    return handleTap;
};
