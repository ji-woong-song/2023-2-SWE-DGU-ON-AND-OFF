import { useCallback, useRef } from 'react';

/**
 * useTouchEvents Hook은 단일 탭, 더블 탭, 그리고 트리플 탭 이벤트를 처리합니다.
 * 이 Hook은 탭 이벤트의 횟수를 추적하고, 각 탭 이벤트에 대응하는 콜백 함수를 호출합니다.
 * 
 * @param {Object} param0 - Hook의 설정을 담은 객체입니다.
 * @param {Function} param0.onSingleTouch - 단일 탭 이벤트 발생 시 호출될 콜백 함수입니다.
 * @param {Function} param0.onDoubleTouch - 더블 탭 이벤트 발생 시 호출될 콜백 함수입니다.
 * @param {Function} param0.onTripleTouch - 트리플 탭 이벤트 발생 시 호출될 콜백 함수입니다.
 * @param {number} delay - 더블 탭 및 트리플 탭을 감지하기 위한 지연 시간(밀리초)입니다. 기본값은 300ms입니다.
 * @returns {Function} - 탭 이벤트를 처리하는 함수를 반환합니다. 이 함수는 연속된 탭의 개수를 기반으로 적절한 콜백을 호출합니다.
 */
export default function useTouchEvents(
    { onSingleTouch, onDoubleTouch, onTripleTouch }: { onSingleTouch?: () => void, onDoubleTouch?: () => void, onTripleTouch?: () => void },
    delay: number = 300
) {
    const tapCountRef = useRef<number>(0); // 연속 탭의 횟수를 추적하는 ref
    const touchTimer = useRef<NodeJS.Timeout | null>(null); // 탭 이벤트 간 지연을 처리하기 위한 타이머 ref

    // 탭 이벤트를 처리하는 함수
    const handleTap = useCallback(() => {
        tapCountRef.current += 1; // 탭 횟수 증가

        if (touchTimer.current) {
            clearTimeout(touchTimer.current); // 이전 타이머가 있다면 제거
        }

        // 지정된 지연 시간 후에 탭 횟수에 따라 적절한 콜백 함수 실행
        touchTimer.current = setTimeout(() => {
            switch (tapCountRef.current) {
                case 1: // 단일 탭
                    if (onSingleTouch) onSingleTouch();
                    break;
                case 2: // 더블 탭
                    if (onDoubleTouch) onDoubleTouch();
                    break;
                case 3: // 트리플 탭
                    if (onTripleTouch) onTripleTouch();
                    break;
            }
            tapCountRef.current = 0; // 탭 횟수 초기화
        }, delay);
    }, [onSingleTouch, onDoubleTouch, onTripleTouch, delay]);

    return handleTap;
}
