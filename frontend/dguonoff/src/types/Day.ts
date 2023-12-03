export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

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
