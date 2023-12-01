package backend.spectrum.dguonoff.event.listener;

import backend.spectrum.dguonoff.email.EmailContentFormatter;
import backend.spectrum.dguonoff.email.EmailService;
import backend.spectrum.dguonoff.email.content.EmailMessage;
import backend.spectrum.dguonoff.event.ReservationConfirmEvent;
import javax.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationConfirmListener {
    private final EmailService emailService;
    @Async
    @EventListener
    public void sendEmail(ReservationConfirmEvent event) throws MessagingException {
        EmailMessage emailMessage = EmailContentFormatter.fromReservationEvent(event);
        emailService.sendEmail(emailMessage);
    }
}
