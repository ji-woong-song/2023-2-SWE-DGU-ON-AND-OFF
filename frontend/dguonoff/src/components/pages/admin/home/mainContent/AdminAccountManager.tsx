/*****************************************************************
 * 관리자 계정 관리 페이지를 렌더링하고, 관리자 계정 관리 기능을 제공하는 컴포넌트입니다.
 *****************************************************************/

import { useEffect, useRef, useState } from "react";
import styles from "./AdminAccountManager.module.css";
import User, { UserRole } from "../../../../../types/User";
import useElementDimensions from "../../../../../hooks/useElementDimensions";
import VirtualizedTable from "../../../../../modules/virtualizedTable/VirtualizedTable";
import { getAuthToken, getUserRole, getUsers, requestDeprivation, requestEmpowerment } from "../../../../../api/dguonandoff";
import { useNavigate } from "react-router-dom";

/**
 * AdminAccountManager 컴포넌트는 'Master'사용자의 관리자 계정 관리를 위한 UI를 제공합니다.
 * 
 * 이 컴포넌트는 사용자 목록을 보여주는 테이블, 사용자의 권한을 변경할 수 있는 드롭다운 메뉴, 
 * 그리고 사용자의 아이디와 역할에 따라 사용자를 필터링할 수 있는 검색 필터를 제공합니다.
 * 관리자는 사용자 목록을 보고, 각 사용자의 역할을 'NORMAL' 또는 'ADMIN'으로 변경할 수 있습니다.
 * 사용자 목록은 가상화된 테이블을 통해 효율적으로 렌더링됩니다.
 * 
 * 컴포넌트 마운트 시, 관리자 권한을 가진 사용자만이 페이지에 접근할 수 있으며,
 * 그렇지 않을 경우 로그인 페이지로 이동합니다.
 * 
 * @returns {JSX.Element} 관리자 계정 관리 페이지를 렌더링하는 JSX 엘리먼트입니다.
 */
export default function AdminAccountManager() {
    // Const 
    const navigate = useNavigate();
    const filterUserRoles: ("All" | UserRole)[] = ["All", "NORMAL", "ADMIN"];
    const userRoles: UserRole[] = ["NORMAL", "ADMIN"];
    const userTableColumns: { name: string, style: React.CSSProperties }[] = [
        { name: "ID", style: { width: "20%" } },
        { name: "SID", style: { width: "20%" } },
        { name: "이메일", style: { width: "40%" } },
        { name: "사용자 권한", style: { width: "20%" } },
    ];


    // Ref
    const userTable = useRef<HTMLDivElement>(null);


    // State
    const [filteringUserRole, setFilteringUserRole] = useState<"All" | UserRole>("All");
    const [filteringUserId, setFilteringUserId] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    // Hook
    const [userTableWidth, userTableHeight] = useElementDimensions(userTable, "Pure");


    // Handler
    const handleRoleChange = async (userIndex: number, newRole: UserRole) => {
        const [token, userRole] = [getAuthToken(), getUserRole()];
        const user = users[userIndex];
        if (token && userRole === "MASTER") {
            switch (newRole) {
                case "NORMAL": {
                    // 관리자 권한 박탈
                    if (user.getRole() === "ADMIN") {
                        if (await requestDeprivation(token, user.getId())) {
                            user.setRole("NORMAL");
                        }
                    }
                    break;
                }
                case "ADMIN": {
                    // 관리자 권한 부여
                    if (user.getRole() === "NORMAL") {
                        if (await requestEmpowerment(token, user.getId())) {
                            user.setRole("ADMIN");
                        }
                    }
                    break;
                }
            }
            setFilteredUsers([...filteredUsers.slice(0, userIndex), user, ...filteredUsers.slice(userIndex + 1)]);
        } else {
            alert("권한이 없습니다.");
            navigate("/admin/login")
        }
    };


    // Effect
    useEffect(() => {
        (async () => {
            const [token, userRole] = [getAuthToken(), getUserRole()];
            if (token && userRole === "MASTER") {
                const reponseUsers = await getUsers(token);
                setUsers(reponseUsers);
                setFilteredUsers(reponseUsers);

            } else {
                alert("권한이 없습니다.");
                navigate("/admin/login")
            }
        })();
    }, [navigate]);


    useEffect(() => {
        // 계정 ID 필터링
        const newUsers = filteringUserId.length === 0 ? users : users.filter((user) => user.getId().includes(filteringUserId));

        // 계정 권한 필터링
        switch (filteringUserRole) {
            case "All": {
                setFilteredUsers(newUsers.filter((user) => user.getRole() === "ADMIN" || user.getRole() === "NORMAL"));
                break;
            }
            case "NORMAL": {
                setFilteredUsers(newUsers.filter((user) => user.getRole() === "NORMAL"));
                break;
            }
            case "ADMIN": {
                setFilteredUsers(newUsers.filter((user) => user.getRole() === "ADMIN"));
                break;
            }
            default: {
                setFilteredUsers([]);
            }
        }
    }, [filteringUserRole, filteringUserId, users]);


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
                <label htmlFor="user-name">유저 ID</label>
                <input type="text" maxLength={50} onChange={(e) => {
                    const validValue = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"|,.<>?]+/g, '');
                    e.target.value = validValue;
                    setFilteringUserId(validValue);
                }} />
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

                numRows={filteredUsers.length}
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
                    const user = filteredUsers[index];
                    return (
                        <div key={index} id={`${index}`} className={rowClassName}
                            style={rowStyle}>
                            <div className={itemClassName} style={itemStyles[0]}>{user.getId()}</div>
                            <div className={itemClassName} style={itemStyles[1]}>{user.getSid()}</div>
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
                                    value={user.getRole()}
                                    onChange={(e) => handleRoleChange(index, e.currentTarget.value as UserRole)}
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