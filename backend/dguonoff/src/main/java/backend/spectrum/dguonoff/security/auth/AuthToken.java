package backend.spectrum.dguonoff.security.auth;

public interface AuthToken <T> {
    boolean validate();
    T getData();
}
