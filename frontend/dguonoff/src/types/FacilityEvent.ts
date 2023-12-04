/**
 * FacilityEvent 클래스는 시설 이벤트 정보를 나타냅니다.
 * 이 클래스는 이벤트의 이름, 주최자 이름, 개요, 목적 및 참석자 수 정보를 관리합니다.
 */
export class FacilityEvent {
    private name: string;
    private hostName: string;
    private outline: string;
    private purpose: string;
    private guestNumber: number;

    /**
     * FacilityEvent 클래스의 생성자입니다.
     * @param {string} name - 이벤트의 이름입니다.
     * @param {string} hostName - 이벤트의 주최자 이름입니다.
     * @param {string} outline - 이벤트의 개요입니다.
     * @param {string} purpose - 이벤트의 목적입니다.
     * @param {number} guestNumber - 예상 참석자 수입니다.
     */
    constructor(name: string = "", hostName: string = "", outline: string = "", purpose: string = "", guestNumber: number = 0) {
        this.name = name;
        this.hostName = hostName;
        this.outline = outline;
        this.purpose = purpose;
        this.guestNumber = guestNumber;
    }

    // getter 및 setter
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }

    public getHostName(): string {
        return this.hostName;
    }
    public setHostName(hostName: string): void {
        this.hostName = hostName;
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

    public getGuestNumber(): number {
        return this.guestNumber;
    }
    public setGuestNumber(guestNumber: number): void {
        this.guestNumber = guestNumber;
    }
}