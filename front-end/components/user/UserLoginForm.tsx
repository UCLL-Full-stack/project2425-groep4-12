import { Role, StatusMessage } from "@types";
import React, { useState } from "react";
import { useRouter } from "next/router";
import UserService from "@services/UserService";
import classNames from "classnames";
import styles from "@styles/home.module.css";
import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | null>("");
    const [role, setRole] = useState<Role>();
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();
    const { t } = useTranslation();

    const clearErrors = () => {
        setNameError(null);
        setPasswordError(null);
        setStatusMessages([]);
    };

    const validate = (): Boolean => {
        let count = 0;
        setFirstName('');
        setLastName('');
        setPasswordError('');
        if (!firstName || firstName.trim() === '') { setNameError(`${t("error.nameReq")}`); count += 1 }
        if (!lastName || lastName.trim() === '') { setNameError(`${t("error.nameReq")}`); count += 1 }
        if (!password || password.trim() === '') { setPasswordError(`${t("error.pwdReq")}`); count += 1 }
        return count == 0;
    }

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();
        if (!validate()) {
            return;
        }

        try {
            const response = await UserService.loginUser({ firstName, lastName, password });
            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify({
                        token: data.token,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        role: data.role,
                    })
                );

                localStorage.setItem("token", data.token);
                localStorage.setItem("firstName", data.firstName);
                localStorage.setItem("lastName", data.lastName);
                localStorage.setItem("role", data.role);

                setStatusMessages([{ type: "success", message: `${t("login.success")}`}])

                setTimeout(() => {
                    router.push("/");
                }, 1000);

            } else {
                setStatusMessages([{ type: "error", message: `${t("login.incorrect")}`}])
            }

        } catch (error) {
            if (error instanceof Error) {
                setStatusMessages([{ type: "error", message: error.message }]);
            } else {
                setStatusMessages([{ type: "error", message: `${t("login.error")}` }]);
            }
            console.error("Error:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <label htmlFor="nameInput" className={styles.label}>
                    {t("login.firstname")}
                </label>
                <div className="p-2">
                    <input
                        id="firstnameInput"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className={styles.inputbox}
                    />
                    {nameError && (
                        <div className={styles.errorMessage}>{nameError}</div>
                    )}
                </div>
                <label htmlFor="lastNameInput" className={styles.label}>
                    {t("login.lastname")}
                </label>
                <div className="p-2">
                    <input
                        id="lastnameInput"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className={styles.inputbox}
                    />
                    {nameError && (
                        <div className={styles.errorMessage}>{nameError}</div>
                    )}
                </div>
                <label htmlFor="passwordInput" className={styles.label}>
                    {t("login.password")}
                </label>
                <div className="p-2">
                    <input
                        id="passwordInput"
                        type="text"
                        value={password}
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

            {statusMessages && (
                <div className="row">
                    <ul className={styles.errorMessage}>
                        {statusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
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
        </>
    )
}

export default UserLoginForm;