import Facility from "./Facility";


export default class Building {
    private name: string;
    private facilities: Facility[];

    constructor(name: string = "", facilities: Facility[] = []) {
        this.name = name;
        this.facilities = facilities;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getFacilities(): Facility[] {
        return this.facilities;
    }

    public setFacilities(facilities: Facility[]): void {
        this.facilities = facilities;
    }
};