export default class Bookmark {
    private facilityName: string;
    private facilityCode: string;
    private buildingName: string;


    constructor(facilityName: string = "", facilityCode: string = "", buildingName: string = "") {
        this.facilityName = facilityName;
        this.facilityCode = facilityCode;
        this.buildingName = buildingName;
    }

    public getFacilityName(): string {
        return this.facilityName;
    }

    public setFacilityName(facilityName: string): void {
        this.facilityName = facilityName;
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
};