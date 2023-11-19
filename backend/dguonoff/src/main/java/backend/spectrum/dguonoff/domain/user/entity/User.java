package backend.spectrum.dguonoff.domain.user.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
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

}
