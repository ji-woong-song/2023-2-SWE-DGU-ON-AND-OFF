
/**
 * FacilityStatus 타입은 시설의 사용 상태를 나타내는 문자열 상수 타입입니다.
 * 이 타입은 시설이 현재 사용 중인지(USING), 아니면 비어 있는지(EMPTY)를 나타내는데 사용됩니다.
 * 'EMPTY'는 시설이 현재 사용되지 않고 이용 가능한 상태임을 의미하며,
 * 'USING'은 시설이 현재 사용 중이거나 예약된 상태임을 의미합니다.
 */
export type FacilityStatus = "EMPTY" | "USING";




/**
 * Facility 클래스는 시설 정보를 나타냅니다.
 * 이 클래스는 시설의 이름, 코드, 북마크 여부, 사용 상태 및 수용 인원 정보를 관리합니다.
 */
export default class Facility {
    private name: string;
    private code: string;
    private bookmarked: boolean;
    private status: "EMPTY" | "USING";
    private capacity: number;

    /**
     * Facility 클래스의 생성자입니다.
     * @param {string} name - 시설의 이름입니다.
     * @param {string} code - 시설의 고유 코드입니다.
     * @param {boolean} bookmarked - 시설이 북마크되었는지 여부입니다.
     * @param {"EMPTY" | "USING"} status - 시설의 사용 상태입니다.
     * @param {number} capacity - 시설의 수용 인원입니다.
     */
    constructor(name: string = "", code: string = "", bookmarked: boolean = false, status: "EMPTY" | "USING" = "EMPTY", capacity: number = 0) {
        this.name = name;
        this.code = code;
        this.bookmarked = bookmarked;
        this.status = status;
        this.capacity = capacity;
    }

    // 이름 관련 getter 및 setter
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }

    // 코드 관련 getter 및 setter
    public getCode(): string {
        return this.code;
    }
    public setCode(code: string): void {
        this.code = code;
    }

    // 북마크 상태 관련 getter 및 setter
    public getBookmarked(): boolean {
        return this.bookmarked;
    }
    public setBookmarked(bookmarked: boolean): void {
        this.bookmarked = bookmarked;
    }

    // 사용 상태 관련 getter 및 setter
    public getStatus(): "EMPTY" | "USING" {
        return this.status;
    }
    public setStatus(status: "EMPTY" | "USING"): void {
        this.status = status;
    }

    // 수용 인원 관련 getter 및 setter
    public getCapacity(): number {
        return this.capacity;
    }
    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }
}