import { Box, Container, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import styles from "../Service.module.css";
import Announcement from "../../../../types/Announcement";
import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CookieStorageProvider } from "../../../../modules/storage/AppStorageProvider";
import { getAnnouncements } from "../../../../api/dguonandoff";
import GrayBorderBox from "../../../../modules/GrayBorderBox";

export default function AnnouncementPage(){
    const title : string = "공지사항";
    const [announcementList, setAnnouncement] = useState<Announcement[]>([]);
    const isUserLoggedIn = useAuth();
    const navigate = useNavigate();

    let userToken : string = "";

    useEffect(() => {
        console.log('isUserLoggedIn:', isUserLoggedIn)
        if (!isUserLoggedIn) {
            navigate('/login'); // 로그인 안되어 있으면 로그인 페이지로 이동
        }else{
            userToken = CookieStorageProvider.get('authToken')!;
            handdleAnnouncement();
        }
      }, [isUserLoggedIn, navigate]);


    const handdleAnnouncement = async () => {
        const announcements : Announcement[] = await getAnnouncements(userToken);
        setAnnouncement(announcements);
    }


    return (
        <Container>
            <Box sx={{ height: '36px' }} />
            <div className={styles.toolBar}>
                <div className={styles.mainTitle}>
                    {title}
                </div>
            </div>
            <List>
                {
                    announcementList.length === 0 ? <div>공지사항이 없습니다.</div> :
                    <>
                        {announcementList.map((announcement, index) => (
                            <GrayBorderBox key={index}>
                                <div className={styles.usingFacilityTitle}>
                                    제목 : {announcement.getTitle()}
                                </div>
                                <div className={styles.announcementAuthor}>
                                    작성자 : {announcement.getAuthorId()}
                                </div>
                                <div style={{paddingTop : '12px'}}>
                                    {announcement.getBody()}
                                </div>
                            </GrayBorderBox>
                    ))}
                    </>
                }
            </List>
        </Container>
    )
}