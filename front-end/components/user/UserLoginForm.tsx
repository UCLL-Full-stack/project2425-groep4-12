import { Role, StatusMessage } from "@types";
import React, { useState } from "react";
import { useRouter } from "next/router"
import LoginService from "@services/LoginService";
import classNames from "classnames";
import styles from "@/styles/Home.module.css"

import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | null>("");
    const [role, setRole] = useState<Role>();
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const {t} = useTranslation();

    const clearErrors = () => {
        setNameError(null);
        setPasswordError(null);
        setStatusMessages([]);
    };

    const validate = (): Boolean => {
        let count = 0;
        setNameError('');
        setPasswordError('');
        if(!name || name.trim()==='') { setNameError('Name is required'); count += 1 }
        if(!password || password.trim()==='') { setPasswordError('Password is required'); count += 1 }
        return count == 0;
    }

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();
        if(!validate()) {
            return;
        }

        try {

            const user = {username: name, password, role: role};
            const response = await LoginService.logInUser(user);
            const data = await response.json();

            if (response.status === 200) {
                //logged in successfully

                const user = await response.json();
                sessionStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({
                        token: user.token,
                        username: user.username,
                        role: user.role,
                    })
                )

                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("role", data.role);
                
                setTimeout(() => {
                    router.push("/");
                }, 1000)

            } else if (response.status === 400 || response.status === 401) {
                //failed to log in

                setStatusMessages([{type: "error", message: data.message}]);
                console.log("error: " + data.message);
            };
        } catch (error) {
            setStatusMessages([{type: "error", message: "An unknown error has occured. Please try again later."}]);
        }
    };


    return (
        <>
            {statusMessages && (
                <div className="row">
                    <ul className={styles.errorMessage}>
                        {statusMessages.map(({message, type}, index) => (
                            <li
                                key = {index}
                                className={classNames({
                                    "text-red-800": type === "error",
                                    "text-green-800": type === "success"
                                })}>
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.description_b}>
                <label
                    htmlFor="nameInput" className={styles.pad}>
                    {t("login.username")}
                    </label>
                    <div className={styles.pad}>
                        <input
                            id = "nameInput"
                            type = "text"
                            value = {name}
                            onChange={(event) => setName(event.target.value)}
                            className={styles.inputbox}
                        />
                        {nameError && (
                            <div className={styles.errorMessage}>{nameError}</div>
                        )}
                    </div>
                <label
                    htmlFor="passwordInput" className={styles.pad}>
                    {t("login.password")}
                    </label>
                    <div className={styles.pad}>
                        <input
                            id = "passwordInput"
                            type = "text"
                            value = {password}
                            onChange={(event) => setPassword(event.target.value)}
                            className={styles.inputbox}
                        />
                        {passwordError && (
                            <div className={styles.errorMessage}>{passwordError}</div>
                        )}
                    </div>

                    <button className={styles.button}>
                        {t("login.submit")}
                    </button>
            </form>
        </>
    )
}

export default UserLoginForm;