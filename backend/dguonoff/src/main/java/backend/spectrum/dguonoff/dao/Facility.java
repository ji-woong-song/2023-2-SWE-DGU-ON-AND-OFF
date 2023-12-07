package backend.spectrum.dguonoff.dao;

import backend.spectrum.dguonoff.dao.model.FacilityStatus;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {
            "facility_code", "building_name"
    })
})
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Facility {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "facility_code",nullable = false)
    private String code;

    @Column(name = "facility_name", nullable = false)
    private String name;

    @Column(name = "capacity",nullable = false)
    private Integer capacity;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @Column(name = "is_bookable", columnDefinition = "BIT DEFAULT 0")
    private boolean isBookable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(15) default 'EMPTY'")
    private FacilityStatus state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_name")
    private Building building;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private FacilityCategory category;

    @OneToMany(mappedBy = "facility")
    private final List<Reservation> reservations = new ArrayList<>();
}
