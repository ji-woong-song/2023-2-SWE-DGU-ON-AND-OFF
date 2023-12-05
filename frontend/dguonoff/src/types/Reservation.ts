import User from "./User";

/**
 * ReservationStatus 타입은 예약의 상태를 나타내는 문자열 상수 타입입니다.
 * 이 타입은 예약이 승인 대기 중인지(PENDING), 승인됐는지(APPROVED),
 * 또는 거부됐는지(REJECTED)를 나타내는데 사용됩니다.
 */
export type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReservationOnOff = "EMPTY" | "USING";


/**
 * Reservation 클래스는 예약 정보를 나타냅니다.
 * 이 클래스는 예약의 ID, 제목, 상태, 날짜, 시작/종료 시간, 시설 코드, 건물 이름, 시설 이름, 개요, 목적,
 * 주최자 및 참석자 목록을 관리합니다.
 */
export default class Reservation {
    private reservationId: number;
    private title: string;
    private status: ReservationStatus;
    private date: string;
    private startTime: string;
    private endTime: string;
    private facilityCode: string;
    private buildingName: string;
    private facilityName: string;
    private facilityState: ReservationOnOff;
    private outline: string;
    private purpose: string;
    private host: User;
    private guests: { id: string; name: string }[];

    /**
     * Reservation 클래스의 생성자입니다.
     * @param {number} reservationId - 예약의 고유 ID입니다.
     * @param {string} title - 예약의 제목입니다.
     * @param {ReservationStatus} status - 예약의 상태입니다.
     * @param {string} date - 예약 날짜입니다.
     * @param {string} startTime - 예약 시작 시간입니다.
     * @param {string} endTime - 예약 종료 시간입니다.
     * @param {string} facilityCode - 예약된 시설의 코드입니다.
     * @param {string} buildingName - 예약된 건물의 이름입니다.
     * @param {string} facilityName - 예약된 시설의 이름입니다.
     * @param {string} outline - 예약의 개요입니다.
     * @param {string} purpose - 예약의 목적입니다.
     * @param {User} host - 예약의 주최자 정보입니다.
     * @param {{ id: string; name: string }[]} guests - 참석자 목록입니다.
     */
    constructor(
        reservationId: number = -1,
        title: string = '',
        status: ReservationStatus = "PENDING",
        date: string = '',
        startTime: string = '',
        endTime: string = '',
        facilityCode: string = '',
        buildingName: string = '',
        facilityName: string = '',
        facilityState : ReservationOnOff = "EMPTY",
        outline: string = '',
        purpose: string = '',
        host: User = new User(),
        guests: { id: string; name: string }[] = []
    ) {
        this.reservationId = reservationId;
        this.title = title;
        this.status = status;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.facilityCode = facilityCode;
        this.buildingName = buildingName;
        this.facilityName = facilityName;
        this.facilityState = facilityState;
        this.outline = outline;
        this.purpose = purpose;
        this.host = host;
        this.guests = guests;
    }

    // getter 및 setter
    public getReservationId(): number {
        return this.reservationId;
    }
    public setReservationId(reservationId: number): void {
        this.reservationId = reservationId;
    }

    public getTitle(): string {
        return this.title;
    }
    public setTitle(title: string): void {
        this.title = title;
    }

    public getStatus(): ReservationStatus {
        return this.status;
    }
    public setStatus(status: ReservationStatus): void {
        this.status = status;
    }

    public getDate(): string {
        return this.date;
    }
    public setDate(date: string): void {
        this.date = date;
    }

    public getStartTime(): string {
        return this.startTime;
    }
    public setStartTime(startTime: string): void {
        this.startTime = startTime;
    }

    public getEndTime(): string {
        return this.endTime;
    }
    public setEndTime(endTime: string): void {
        this.endTime = endTime;
    }

    public getFacilityCode(): string {
        return this.facilityCode;
    }
    public setFacilityCode(facilityCode: string): void {
        this.facilityCode = facilityCode;
    }

    public getBuildingName(): string {
        return this.buildingName;
    }
    public setBuildingName(buildingName: string): void {
        this.buildingName = buildingName;
    }

    public getFacilityName(): string {
        return this.facilityName;
    }
    public setFacilityName(facilityName: string): void {
        this.facilityName = facilityName;
    }

    public getFacilityState(): ReservationOnOff {
        return this.facilityState;
    }

    public setFacilityState(facilityState: ReservationOnOff): void {
        this.facilityState = facilityState;
    }

    public getOutline(): string {
        return this.outline;
    }
    public setOutline(outline: string): void {
        this.outline = outline;
    }

    public getPurpose(): string {
        return this.purpose;
    }
    public setPurpose(purpose: string): void {
        this.purpose = purpose;
    }

    public getHost(): User {
        return this.host;
    }
    public setHost(host: User): void {
        this.host = host;
    }

    public getGuests(): { id: string; name: string; }[] {
        return this.guests;
    }
    public setGuests(guests: { id: string; name: string; }[]): void {
        this.guests = guests;
    }
}
