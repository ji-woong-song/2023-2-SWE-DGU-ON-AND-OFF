import { Container, Toolbar } from "@mui/material";
import styles from "../Service.module.css";

export default function AnnouncementPage(){
    const title : string = "공지사항";


    return (
        <Container>
            <Toolbar>
                <div className={styles.mainTitle}>
                    {title}
                </div>
            </Toolbar>
        </Container>
    )
}