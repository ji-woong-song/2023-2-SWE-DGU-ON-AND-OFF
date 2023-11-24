package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.model.Role;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "User")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "password", length = 512, nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "name", length = 20, nullable = false)
    private String name;

    @Column(name = "major", length = 64)
    private String major;

    @Column(name = "email", length = 255)
    private String email;

    @OneToMany(mappedBy = "userId")
    private List<Bookmark> bookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "hotUserId")
    private List<Reservation> reservations = new ArrayList<>();

    public User(long id, String password, Role normal, String userA, String cse, String email) {
        this.id = id;
        this.password = password;
        this.role = normal;
        this.name = userA;
        this.major = cse;
        this.email = email;
    }
}
