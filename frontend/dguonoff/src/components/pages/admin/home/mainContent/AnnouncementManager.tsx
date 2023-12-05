
import { useEffect, useRef, useState } from "react";
import styles from "./AnnouncementManager.module.css";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import { getAnnouncementBody, getAnnouncements, getAuthToken, getUserRole, modifyAnnouncement, registerAnnouncement, removeAnnouncement } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";
import Announcement from "../../../../../types/Announcement";
import { useModal } from "../../../../../modules/modal/Modal";
import { ModalAnimationType } from "../../../../../modules/modal/ModalAnimations";


export default function AnnouncementManager() {
    // Const 
    const navigate = useNavigate();
    const announcementTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "번호", style: { width: "175px" } },
        { name: "제목", style: { width: "calc(100% - 175px - 250px)" } },
        { name: "글쓴이", style: { width: "250px" } },
    ];


    // Ref
    const announcementTable = useRef<HTMLDivElement>(null);
    const currTitle = useRef<string>("");
    const currBody = useRef<string>("");
    const currBoardId = useRef<number>(-1);


    // State
    const [filteringTitle, setFilteringTitle] = useState<string>("");
    const [filteringAuthorId, setFilteringAuthorId] = useState<string>("");
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
    const [announcementMode, setAnnouncementMode] = useState<"READ" | "WRITE">("READ");


    // Hook
    const announcementTableHeight = useElementDimensions(announcementTable, "Pure")[1];
    const [WriteAnnouncementModal, openWriteAnnouncementModal, closeWriteAnnouncementModal] = useModal(ModalAnimationType.ZOOM);


    // Handler
    const onDisplayAnnouncement = async (type: "READ" | "WRITE", announcement?: Announcement) => {
        switch (type) {
            case "READ": {
                if (announcement) {
                    const [token, userRole] = [getAuthToken(), getUserRole()];
                    if (token && userRole) {
                        const respoenseBody = await getAnnouncementBody(token, announcement.getBoardId());
                        if (respoenseBody) {
                            setAnnouncementMode("READ");
                            openWriteAnnouncementModal();
                            currBoardId.current = announcement.getBoardId();
                            currTitle.current = respoenseBody.title;
                            currBody.current = respoenseBody.body;
                        }
                    }
                }
                break;
            }
            case "WRITE": {
                currTitle.current = "";
                currBody.current = "";
                currBoardId.current = -1;
                setAnnouncementMode("WRITE");
                openWriteAnnouncementModal();
                break;
            }
            default: { }
        }
    };

    const onRegisterAnnouncement = async () => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole && userRole !== "NORMAL") {
            if (await registerAnnouncement(token, currTitle.current, currBody.current)) {
                setAnnouncements(await getAnnouncements(token));
                alert("공지사항을 등록했습니다.");
            } else {
                alert("공지사항 등록에 실패했습니다");
            }
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
        closeWriteAnnouncementModal();
    };

    const onRemoveAnnouncement = async () => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole && userRole !== "NORMAL") {
            if (await removeAnnouncement(token, currBoardId.current)) {
                setAnnouncements(await getAnnouncements(token));
                alert("공지사항을 삭제했습니다.");
            } else {
                alert("공지사항 삭제에 실패했습니다");
            }
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
        closeWriteAnnouncementModal();
    };

    const onModifyAnnouncement = async () => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        if (token && userRole && userRole !== "NORMAL") {
            if (await modifyAnnouncement(token, currBoardId.current, currTitle.current, currBody.current)) {
                setAnnouncements(await getAnnouncements(token));
                alert("공지사항을 수정했습니다.");
            } else {
                alert("공지사항 수정에 실패했습니다");
            }
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
        closeWriteAnnouncementModal();
    };



    // Effect
    useEffect(() => {
        (async () => {
            const [token, userRole] = [getAuthToken(), getUserRole()];
            if (token && userRole) {
                const reponseAnnouncements = await getAnnouncements(token);
                setAnnouncements(reponseAnnouncements);
                setFilteredAnnouncements(reponseAnnouncements);

            } else {
                alert("권한이 없습니다.");
                navigate("/admin/login")
            }
        })();
    }, [navigate]);

    useEffect(() => {
        let newAnnouncements = filteringTitle.length === 0 ? announcements : announcements.filter((announcement) => announcement.getTitle().includes(filteringTitle));
        newAnnouncements = filteringAuthorId.length === 0 ? newAnnouncements : newAnnouncements.filter((announcement) => announcement.getAuthorId().includes(filteringAuthorId));
        setFilteredAnnouncements(newAnnouncements);
    }, [filteringTitle, filteringAuthorId, announcements]);


    // Render
    return (<div className={styles.AnnouncementManager}>
        <div className={styles.search_filter}>
            <div className={styles.announcement_title}>
                <label htmlFor="user-name">게시물 제목</label>
                <input type="text" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setFilteringTitle(validValue);
                }} />
            </div>
            <div className={styles.authorId}>
                <label htmlFor="user-name">작성자 ID</label>
                <input type="text" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setFilteringAuthorId(validValue);
                }} />
            </div>
            <div className={styles.buttons}>
                <button className={styles.write} onClick={() => { onDisplayAnnouncement("WRITE"); }}>게시물 작성</button>
            </div>
        </div>
        <div className={styles.user_table} ref={announcementTable}>
            <VirtualizedTable
                windowHeight={announcementTableHeight - 4}
                tableStyles={{
                    height: "calc(100% - 4px)",
                    width: "calc(100% - 4px)",
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "2px solid var(--component-main-color)"
                }}

                numColumns={announcementTableColumns.length}
                columnHeight={35}
                columnWidths={announcementTableColumns.map((column) => column.style)}
                columnStyles={{
                    userSelect: "none",
                    backgroundColor: "var(--component-main-light-color)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "17px",
                    fontWeight: "600"
                }}
                renderColumns={({ index, columnClassName, columnStyle }) => {
                    return (
                        <div key={index} className={columnClassName}
                            style={columnStyle}>
                            {announcementTableColumns[index].name}
                        </div>
                    );
                }}

                numRows={filteredAnnouncements.length}
                rowHeight={45}
                rowStyles={{
                    default: {
                        userSelect: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "20px",
                        cursor: "pointer",
                        backgroundColor: "var(--component-inner-color)"
                    },
                    hover: {
                        backgroundColor: "var(--component-main-light-color)"
                    }
                }}
                renderRows={({ index, rowClassName, rowStyle, itemClassName, itemStyles }) => {
                    const announcement = filteredAnnouncements[index];
                    return (
                        <div key={index} id={`${index}`} className={rowClassName}
                            onClick={() => { onDisplayAnnouncement("READ", announcement); }}
                            style={rowStyle}>
                            <div className={itemClassName} style={itemStyles[0]}>{announcement.getBoardId()}</div>
                            <div className={itemClassName} style={itemStyles[1]}>{announcement.getTitle()}</div>
                            <div className={itemClassName} style={itemStyles[2]}>{announcement.getAuthorId()}</div>
                        </div>
                    );
                }}
            />
        </div>

        <WriteAnnouncementModal>
            <div className={styles.write_announcement}>
                <div className={styles.write_modal_top}>
                    <div className={styles.announcement_title}>
                        <label htmlFor="user-name">제목</label>
                        <input type="text" maxLength={50} defaultValue={currTitle.current} onChange={(e) => { currTitle.current = e.target.value; }} />
                    </div>
                    <div className={styles.announcement_buttons}>
                        {announcementMode === "WRITE" ? (<>
                            <button className={styles.submit} onClick={() => { onRegisterAnnouncement() }}>게시물 작성</button>
                            <button className={styles.close} onClick={() => { closeWriteAnnouncementModal() }}>닫기</button>
                        </>) : (<>
                            <button className={styles.modify} onClick={() => { onModifyAnnouncement() }}>수정</button>
                            <button className={styles.remove} onClick={() => { onRemoveAnnouncement() }}>삭제</button>
                            <button className={styles.close} onClick={() => { closeWriteAnnouncementModal() }}>닫기</button>
                        </>)}
                    </div>
                </div>
                <div className={styles.write_modal_middle}>
                    <div className={styles.announcement_body}>
                        <textarea maxLength={5000} rows={4} defaultValue={currBody.current} onChange={(e) => { currBody.current = e.target.value; }} />
                    </div>
                </div>
            </div>
        </WriteAnnouncementModal>
    </div >
    );
}