import Facility from "./Facility";

export type ReservationStatus = "pending" | "accept" | "reject";


export default class Reservation {
    private id: string;
    private reserver: string;
    private facility: Facility;
    private startTime: Date;
    private endTime: Date;
    private status: ReservationStatus;

    constructor(
        id: string = "",
        reserver: string = "",
        facility: Facility = new Facility(),
        dateTime: Date = new Date(),
        endTime: Date = new Date(),
        status: ReservationStatus = "pending") {
        this.id = id;
        this.reserver = reserver;
        this.facility = facility;
        this.startTime = dateTime;
        this.endTime = endTime;
        this.status = status;
    }

    public getId(): string {
        return this.id;
    }
    public setId(id: string): void {
        this.id = id;
    }

    public getReserver(): string {
        return this.reserver;
    }
    public setReserver(reserver: string): void {
        this.reserver = reserver;
    }

    public getFacility(): Facility {
        return this.facility;
    }
    public setFacility(facility: Facility): void {
        this.facility = facility;
    }

    public getStartTime(): Date {
        return this.startTime;
    }
    public setStartTime(dateTime: Date): void {
        this.startTime = dateTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }
    public setEndTime(endTime: Date): void {
        this.endTime = endTime;
    }

    public getStatus(): ReservationStatus {
        return this.status;
    }
    public setStatus(status: ReservationStatus): void {
        this.status = status;
    }
}
