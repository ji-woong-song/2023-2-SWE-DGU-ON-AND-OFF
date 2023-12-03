package backend.spectrum.dguonoff.DAO;

import static org.junit.jupiter.api.Assertions.*;

import backend.spectrum.dguonoff.domain.admin.repository.EventRepository;
import backend.spectrum.dguonoff.domain.admin.repository.FixedScheduleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class FixedScheduleTest {
    @Autowired private final FixedScheduleRepository fixedScheduleRepository;
    @Autowired private final EventRepository eventRepository;

    FixedScheduleTest(
            FixedScheduleRepository fixedScheduleRepository,
            EventRepository eventRepository
    ) {
        this.fixedScheduleRepository = fixedScheduleRepository;
        this.eventRepository = eventRepository;
    }

    @Test
    @Transactional
    public void 예약_삭제() {

    }
}