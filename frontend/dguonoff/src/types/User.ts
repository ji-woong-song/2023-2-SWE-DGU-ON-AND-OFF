export type UserRole = "NORMAL" | "ADMIN" | "MASTER";

/**
 * User 클래스는 사용자 정보를 나타냅니다.
 * 이 클래스는 사용자의 SID, ID, 전공, 이메일, 역할 정보를 관리합니다.
 */
export default class User {
    private id: string;
    private sid: string;
    private major: string;
    private email: string;
    private role: UserRole;

    /**
     * User 클래스의 생성자입니다.
     * @param {string} sid - 사용자의 학교 ID입니다.
     * @param {string} id - 사용자의 고유 ID입니다.
     * @param {string} major - 사용자의 전공입니다.
     * @param {string} email - 사용자의 이메일 주소입니다.
     * @param {UserRole} role - 사용자의 역할입니다.
     */
    constructor(id: string = "", sid: string = "", major: string = "", email: string = "", role: UserRole = "NORMAL") {
        this.id = id;
        this.sid = sid;
        this.major = major;
        this.email = email;
        this.role = role;
    }

    // ID 관련 getter 및 setter
    public getId(): string {
        return this.id;
    }
    public setId(id: string): void {
        this.id = id;
    }

    // SID 관련 getter 및 setter
    public getSid(): string {
        return this.sid;
    }
    public setSid(sid: string): void {
        this.sid = sid;
    }

    // 전공 관련 getter 및 setter
    public getMajor(): string {
        return this.major;
    }
    public setMajor(major: string): void {
        this.major = major;
    }

    // 이메일 관련 getter 및 setter
    public getEmail(): string {
        return this.email;
    }
    public setEmail(email: string): void {
        this.email = email;
    }

    // 역할 관련 getter 및 setter
    public getRole(): UserRole {
        return this.role;
    }
    public setRole(role: UserRole): void {
        this.role = role;
    }
}
