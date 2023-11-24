package backend.spectrum.dguonoff.DAO;

import backend.spectrum.dguonoff.DAO.model.FacilityStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Facility")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Facility {

    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityStatus state;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "capacity",nullable = false)
    private int capacity;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "building_name", length = 255, nullable = false)
    private String buildingName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private FacilityCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private Building building_name;

    @OneToMany(mappedBy = "facility")
    private List<Reservation> reservations = new ArrayList<>();

}
