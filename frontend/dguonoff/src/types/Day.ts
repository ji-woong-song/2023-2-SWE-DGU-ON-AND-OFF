/**
 * Day 타입은 요일을 나타내는 문자열 상수 타입입니다.
 * 이 타입은 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'를 값으로 가집니다.
 */
export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";




/**
 * dayToKor 함수는 영문 요일을 한글로 변환합니다.
 * 이 함수는 Day 타입의 값을 받아 해당하는 한글 요일의 축약 문자열을 반환합니다.
 * 
 * @param {Day} day - 영문 요일을 나타내는 Day 타입의 값입니다.
 * @returns {string} - 해당 영문 요일에 대응하는 한글 요일 문자열을 반환합니다.
 */
export function dayToKor(day: Day): string {
    const dayTranslations: { [key in Day]: string } = {
        "MONDAY": "월",
        "TUESDAY": "화",
        "WEDNESDAY": "수",
        "THURSDAY": "목",
        "FRIDAY": "금",
        "SATURDAY": "토",
        "SUNDAY": "일"
    };

    return dayTranslations[day];
}
