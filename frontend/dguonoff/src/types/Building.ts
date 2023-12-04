
/**
 * Building 클래스는 건물 정보를 나타냅니다.
 * 이 클래스는 건물의 이름과 총 층수를 관리하며, 이름과 총 층수의 조회 및 설정 기능을 제공합니다.
 */
export default class Building {
    private name: string;
    private maxFloor: number;

    /**
     * Building 클래스의 생성자입니다.
     * @param {string} name - 건물의 이름입니다. 기본값은 빈 문자열("")입니다.
     * @param {number} maxFloor - 건물의 총 층수입니다. 기본값은 0입니다.
     */
    constructor(name: string = "", maxFloor: number = 0) {
        this.name = name;
        this.maxFloor = maxFloor;
    }

    // 이름 관련 getter 및 setter
    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    // 층수 관련 getter 및 setter
    public getMaxFloor(): number {
        return this.maxFloor;
    }

    public setMaxFloor(floor: number): void {
        this.maxFloor = floor;
    }
};
