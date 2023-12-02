import { useRef } from 'react';

/**
 * useTouchHoldEvents Hook은 지정된 지속 시간 동안의 터치를 감지하여 이벤트를 처리합니다.
 * 지속 시간이 경과하면 onTouchStart 콜백을 실행하고, 터치가 끝나면 onTouchEnd 콜백을 실행합니다.
 * 
 * @param {Object} param0 - Hook의 옵션 객체입니다.
 * @param {Function} param0.onTouchStart - 지속 시간이 경과했을 때 호출될 콜백 함수입니다.
 * @param {Function} [param0.onTouchEnd] - 지속 시간이 경과한 후 터치가 끝났을 때 호출될 콜백 함수입니다. 선택적입니다.
 * @param {number} param0.touchDuration - 터치가 지속되어야 하는 시간(밀리초 단위)입니다.
 * @returns {Object} - 터치 시작과 끝을 처리하는 이벤트 핸들러 함수를 포함한 객체를 반환합니다.
 */
export default function useTouchHoldEvents(
    { onTouchStart, onTouchEnd, touchDuration }: { onTouchStart: () => void, onTouchEnd?: () => void, touchDuration: number }
) {
    const timer = useRef<NodeJS.Timeout | null>(null); // 타이머를 위한 ref
    const durationReached = useRef<boolean>(false); // 지속 시간이 경과했는지 여부를 추적하기 위한 ref

    // 터치 시작 시 호출되는 함수
    const handleTouchStart = () => {
        durationReached.current = false; // 지속 시간 경과 여부 초기화
        const newTimer = setTimeout(() => {
            onTouchStart(); // 지정된 지속 시간이 경과하면 onTouchStart 콜백 실행
            durationReached.current = true; // 지속 시간이 경과했음을 표시
        }, touchDuration + 200); // 설정된 지속 시간 + 200ms (혹시 모를 지연시간 고려)
        timer.current = newTimer; // 타이머 ref 업데이트
    };

    // 터치가 끝났을 때 호출되는 함수
    const handleTouchEnd = () => {
        if (timer.current) {
            clearTimeout(timer.current); // 타이머 취소
            timer.current = null; // 타이머 ref 초기화
        }
        if (durationReached.current) {
            onTouchEnd && onTouchEnd(); // 지속 시간이 경과한 후에 터치가 끝났을 때 onTouchEnd 콜백 실행
        }
    };

    return { handleTouchStart, handleTouchEnd }; // 이벤트 핸들러 함수들을 반환
}
