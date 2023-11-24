import { useEffect, useRef, useState } from "react";
import styles from "./AdminAccountManager.module.css";
import User, { UserRole } from "../../../../../types/User";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";



export default function AdminAccountManager() {
    // Const 
    const filterUserRoles: ("all" | UserRole)[] = ["all", "user", "admin"];
    const userRoles: UserRole[] = ["user", "admin", "master"];
    const userTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "ID", style: { width: "20%" } },
        { name: "이름", style: { width: "20%" } },
        { name: "이메일", style: { width: "40%" } },
        { name: "사용자 권한", style: { width: "20%" } },
    ];


    // Ref
    const userTable = useRef<HTMLDivElement>(null);


    // State
    const [filteringUserRole, setFilteringUserRole] = useState<"all" | UserRole>("all");
    const [users, setUsers] = useState<User[]>([]);
    const [userRoleEdits, setUserRoleEdits] = useState(new Map());



    // Hook
    const [userTableWidth, userTableHeight] = useElementDimensions(userTable, "Pure");


    // Handler
    const saveChanges = () => {
        setUsers(users.map(user => {
            const editedRole = userRoleEdits.get(user.getId());
            if (editedRole) {
                return new User(user.getId(), user.getName(), user.getEmail(), editedRole);
            }
            return user;
        }));
        setUserRoleEdits(new Map()); // 변경 사항을 저장한 후 초기화
    };

    const undoChanges = () => {
        setUserRoleEdits(new Map()); // 변경 사항을 초기화
    };

    const handleRoleChange = (userId: number, newRole: UserRole) => {
        setUserRoleEdits(new Map(userRoleEdits).set(userId, newRole));
    };




    // Effect
    useEffect(() => {
        setUsers(Array.from({ length: 50 }, () => {
            const id = Math.floor(Math.random() * 9000000000) + 1000000000; // 10자리 정수
            const name = `User_${id}`;
            const email = `user${id}@example.com`;
            const roles: UserRole[] = ["user", "admin", "master"];
            const role = roles[Math.floor(Math.random() * roles.length)];
            return new User(id, name, email, role);
        }));
    }, []);


    // Render
    return (<div className={styles.adminAccountManager}>
        <div className={styles.search_filter}>
            <div className={styles.account_type}>
                <label htmlFor="userRole-select">계정 권한</label>
                <select onChange={(e) => setFilteringUserRole(filterUserRoles[e.target.selectedIndex])}>
                    {filterUserRoles.map((userRole, index) => (
                        <option key={index} value={userRole}>
                            {userRole}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.user_name}>
                <label htmlFor="user-name">유저 이름</label>
                <input type="text" maxLength={50} />
                <button className={styles.search}>조회</button>
            </div>
            <div className={styles.buttons}>
                <button className={styles.save} onClick={saveChanges}>저장</button>
                <button className={styles.undo} onClick={undoChanges}>되돌리기</button>
            </div>
        </div>
        <div className={styles.user_table} ref={userTable}>
            <VirtualizedTable
                windowHeight={userTableHeight - 4}
                tableStyles={{
                    height: "calc(100% - 4px)",
                    width: "calc(100% - 4px)",
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "2px solid var(--component-main-color)"
                }}

                numColumns={userTableColumns.length}
                columnHeight={35}
                columnWidths={userTableColumns.map((column) => column.style)}
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
                            {userTableColumns[index].name}
                        </div>
                    );
                }}

                numRows={users.length}
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
                    const user = users[index];
                    return (
                        <div key={index} id={`${index}`} className={rowClassName}
                            style={rowStyle}>
                            <div className={itemClassName} style={itemStyles[0]}>{user.getId()}</div>
                            <div className={itemClassName} style={itemStyles[1]}>{user.getName()}</div>
                            <div className={itemClassName} style={itemStyles[2]}>{user.getEmail()}</div>
                            <div className={itemClassName} style={itemStyles[3]}>
                                <select style={{
                                    width: "40%",
                                    height: "70%",
                                    padding: "2px",
                                    borderRadius: "10px",
                                    border: "2px solid var(--component-main-color)",
                                    fontSize: "17px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                                    value={userRoleEdits.get(user.getId()) || user.getRole()}
                                    onChange={(e) => handleRoleChange(user.getId(), e.target.value as UserRole)}
                                >
                                    {userRoles.map((userRole, index) => (
                                        <option key={index} value={userRole}>
                                            {userRole}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    </div >);
}