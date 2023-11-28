package backend.spectrum.dguonoff.domain.user.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    private String id;

    @Column(name = "password", length = 512, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(16) DEFAULT 'NORMAL'")
    private Role role;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "major", length = 64)
    private String major;

    @Column(name = "email", nullable = false, length = 255)
    private String email;
}

