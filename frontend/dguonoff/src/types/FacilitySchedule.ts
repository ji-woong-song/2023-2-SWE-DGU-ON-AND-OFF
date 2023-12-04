import { FacilityEvent } from "./FacilityEvent";

/**
 * FacilitySchedule 클래스는 시설 일정 정보를 나타냅니다.
 * 이 클래스는 일정의 시작 시간, 종료 시간 및 관련 이벤트 정보를 관리합니다.
 */
export default class FacilitySchedule {
    private scheduleId: number;
    private startTime: Date;
    private endTime: Date;
    private event: FacilityEvent;

    /**
     * FacilitySchedule 클래스의 생성자입니다.
     * @param {Date} startTime - 일정의 시작 시간입니다.
     * @param {Date} endTime - 일정의 종료 시간입니다.
     * @param {FacilityEvent} event - 관련된 이벤트 객체입니다.
     */
    constructor(scheduleId: number = -1, startTime: Date = new Date(), endTime: Date = new Date(), event: FacilityEvent = new FacilityEvent()) {
        this.scheduleId = scheduleId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.event = event;
    }

    // getter 및 setter
    public getScheduleId(): number {
        return this.scheduleId;
    }
    public setScheduleId(scheduleId: number): void {
        this.scheduleId = scheduleId;
    }

    public getStartTime(): Date {
        return this.startTime;
    }
    public setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
    public setEndTime(endTime: Date): void {
        this.endTime = endTime;
    }

    public getEvent(): FacilityEvent {
        return this.event;
    }
    public setEvent(event: FacilityEvent): void {
        this.event = event;
    }
}