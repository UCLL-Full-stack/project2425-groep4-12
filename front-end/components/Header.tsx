import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/home.module.css"
import { useTranslation } from "next-i18next";
import Language from "./language";

const Header: React.FC = () => {

    const {t} = useTranslation();

    const [loggedInUser, setLoggedInUser] = useState<String|null>(null);
    
    useEffect(() => {
        setLoggedInUser(sessionStorage.getItem("loggedInUser"));
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        window.location.href="/"
    };

    return (
        <header className={styles.header}>
            <a className={styles.title}>
                {t("header.title")}
            </a>

            <nav className={styles.nav}>
                <Link href="/">
                    {t("header.homepage")}
                </Link>
                
                {/* <Link href="/event">
                    {t("header.event")}
                </Link>
                <Link href="/team">
                    {t("header.teams")}
                </Link> */}

                {!loggedInUser && (
                    <Link
                        href="/login"
                    >
                        {t("header.login")}
                    </Link>
                )}

                {loggedInUser && (
                    <>
                        <Link href="/event">
                            {t("header.event")}
                        </Link>
                        <Link href="/team">
                            {t("header.teams")}
                        </Link>
                                
                        <a
                            href="#"
                            onClick={handleLogout}
                        > 
                            {t("header.logout")}
                        </a>
                        <a
                            href="/user"
                        >
                            {t("header.profile")}
                        </a>
                    </>
                )}
                <Language/>
            </nav>
        </header>
    )
}

export default Header;