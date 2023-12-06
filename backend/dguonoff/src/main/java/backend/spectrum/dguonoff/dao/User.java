package backend.spectrum.dguonoff.dao;

import backend.spectrum.dguonoff.dao.model.Role;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "User")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "sid", length = 20, nullable = false)
    private String sid;

    @Column(name = "password", length = 512, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(16) DEFAULT 'NORMAL'")
    private Role role;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "major", length = 64)
    private String major;

    @Column(name = "email", nullable = false)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark> bookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "hotUserId")
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Board> boards = new ArrayList<>();

    public User(String id, String sid, String password, Role role, String name, String major, String email) {
        this.id = id;
        this.sid = sid;
        this.password = password;
        this.role = role;
        this.name = name;
        this.major = major;
        this.email = email;
    }
    public void addBookmark(Bookmark bookmark) {
        this.bookmarks.add(bookmark);
    }
    public void addBoard(Board board) {this.boards.add(board);}
}

