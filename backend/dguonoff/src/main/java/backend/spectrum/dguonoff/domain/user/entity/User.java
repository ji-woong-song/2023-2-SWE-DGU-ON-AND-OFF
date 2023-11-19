package backend.spectrum.dguonoff.domain.user.entity;

import backend.spectrum.dguonoff.domain.user.entity.enumeration.UserRole;
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
    private Long id;

    @Column(nullable = false, length = 512)
    private String password;

    @Column(nullable = false, length = 32)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(16) DEFAULT 'NORMAL'")
    private UserRole role;
}
