import styles from "./Welcome.module.css";

export default function Welcome() {
    return (
        <div className={styles.welcome}>
            <img src="/images/logo.gif" alt="Logo" />
        </div>
    )
}