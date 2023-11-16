
export default class Facility {
    private name: string;

    constructor(name: string = "") {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}