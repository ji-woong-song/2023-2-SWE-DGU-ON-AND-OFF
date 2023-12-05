
/**
 * Announcement 클래스는 공지사항 정보를 나타냅니다.
 * 이 클래스는 공지사항의 게시판 ID, 제목, 작성자 ID를 관리하며, 이들의 조회 및 설정 기능을 제공합니다.
 */
export default class Announcement {
    private boardId: number;
    private title: string;
    private body: string;
    private authorId: string;

    /**
     * Announcement 클래스의 생성자입니다.
     * @param {number} boardId - 공지사항이 게재된 게시판의 ID입니다. 기본값은 빈 문자열("")입니다.
     * @param {string} title - 공지사항의 제목입니다. 기본값은 빈 문자열("")입니다.
     * @param {string} authorId - 공지사항의 작성자 ID입니다. 기본값은 빈 문자열("")입니다.
     */
    constructor(boardId: number = -1, title: string = "", body: string = "", authorId: string = "") {
        this.boardId = boardId;
        this.title = title;
        this.body = body;
        this.authorId = authorId;
    }

    // getter 및 setter
    public getBoardId(): number {
        return this.boardId;
    }

    public setBoardId(boardId: number): void {
        this.boardId = boardId;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }

    public getBody(): string {
        return this.body;
    }

    public setBody(body: string): void {
        this.body = body;
    }

    public getAuthorId(): string {
        return this.authorId;
    }

    public setAuthorId(authorId: string): void {
        this.authorId = authorId;
    }
}
