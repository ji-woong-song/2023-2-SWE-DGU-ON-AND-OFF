export type UserRole = "user" | "admin" | "master";

export default class User {
    private id: number;
    private name: string;
    private email: string;
    private role: UserRole;

    constructor(id: number = 0, name: string = "", email: string = "", role: UserRole = "user") {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public getId(): number {
        return this.id;
    }
    public setId(value: number): void {
        this.id = value;
    }

    public getName(): string {
        return this.name;
    }
    public setName(value: string): void {
        this.name = value;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(value: string): void {
        this.email = value;
    }

    public getRole(): UserRole {
        return this.role;
    }
    public setRole(value: UserRole): void {
        this.role = value;
    }
}
