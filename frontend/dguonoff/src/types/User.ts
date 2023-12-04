
/**
 * UserRole 타입은 사용자의 역할을 나타내는 문자열 상수 타입입니다.
 * 이 타입은 사용자가 일반 사용자(NORMAL), 관리자(ADMIN),
 * 또는 마스터(MASTER) 역할을 가지고 있는지를 나타내는데 사용됩니다.
 */
export type UserRole = "NORMAL" | "ADMIN" | "MASTER";




/**
 * User 클래스는 사용자 정보를 나타냅니다.
 * 이 클래스는 사용자의 고유 ID, 학교 ID, 이름, 전공, 이메일, 역할 정보를 관리합니다.
 */
export default class User {
    private id: string;
    private sid: string;
    private name: string;
    private major: string;
    private email: string;
    private role: UserRole;

    /**
     * User 클래스의 생성자입니다.
     * @param {string} id - 사용자의 고유 ID입니다.
     * @param {string} sid - 사용자의 학교 ID입니다.
     * @param {string} name - 사용자의 이름입니다.
     * @param {string} major - 사용자의 전공입니다.
     * @param {string} email - 사용자의 이메일 주소입니다.
     * @param {UserRole} role - 사용자의 역할입니다.
     */
    constructor(id: string = "", sid: string = "", name: string = "", major: string = "", email: string = "", role: UserRole = "NORMAL") {
        this.id = id;
        this.sid = sid;
        this.name = name;
        this.major = major;
        this.email = email;
        this.role = role;
    }

    // getter 및 setter
    public getId(): string {
        return this.id;
    }
    public setId(id: string): void {
        this.id = id;
    }

    public getSid(): string {
        return this.sid;
    }
    public setSid(sid: string): void {
        this.sid = sid;
    }

    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }

    public getMajor(): string {
        return this.major;
    }
    public setMajor(major: string): void {
        this.major = major;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(email: string): void {
        this.email = email;
    }

    public getRole(): UserRole {
        return this.role;
    }
    public setRole(role: UserRole): void {
        this.role = role;
    }
}
