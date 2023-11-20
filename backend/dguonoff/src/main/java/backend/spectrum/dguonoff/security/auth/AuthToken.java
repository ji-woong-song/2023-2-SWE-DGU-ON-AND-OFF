package backend.spectrum.dguonoff.security.auth;

public interface AuthToken <T> {
    String AUTHORITIES_KEY = "role";
    boolean validate();
    T getData();
}
