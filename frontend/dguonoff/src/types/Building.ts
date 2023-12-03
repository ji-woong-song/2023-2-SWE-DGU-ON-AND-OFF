/**
 * Building 클래스는 건물 정보를 나타냅니다.
 * 이 클래스는 건물의 이름을 관리하며, 이름의 조회 및 설정 기능을 제공합니다.
 */
export default class Building {
    private name: string;

    /**
     * Building 클래스의 생성자입니다.
     * @param {string} name - 건물의 이름입니다. 기본값은 빈 문자열("")입니다.
     */
    constructor(name: string = "") {
        this.name = name;
    }

    // 이름 관련 getter 및 setter
    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
};
