package backend.spectrum.dguonoff.domain.admin.repository;


import backend.spectrum.dguonoff.dao.FixedSchedule;
import java.time.DayOfWeek;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedScheduleRepository extends JpaRepository<FixedSchedule, Long> {
    List<FixedSchedule> findByDayAndFacility_Building_NameAndFacility_Code(
            DayOfWeek day, String buildingName, String facilityCode
    );
}
