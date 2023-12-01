package backend.spectrum.dguonoff.event.listener;

import backend.spectrum.dguonoff.event.ReservationConfirmEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ReservationConfirmListener {
    @Async
    @EventListener
    public void sendEmail(ReservationConfirmEvent event) throws InterruptedException{

    }
}
