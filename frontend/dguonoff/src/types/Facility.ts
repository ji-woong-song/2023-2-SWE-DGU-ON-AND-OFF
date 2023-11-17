
export default class Facility {
    private name: string;
    private capacity: number;

    constructor(name: string = "", capacity: number = 0) {
        this.name = name;
        this.capacity = capacity;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }
}