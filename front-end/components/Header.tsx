import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/home.module.css"
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {

    const {t} = useTranslation();

    const [loggedInUser, setLoggedInUser] = useState<String|null>(null);
    
    useEffect(() => {
        setLoggedInUser(sessionStorage.getItem("loggedInUser"));
    }, []);

    const handleClick = () => {
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
                <Link href="/" className={styles.card}>
                    {t("header.homepage")}
                </Link>
                <Link href="/training" className={styles.card}>
                    {t("header.training")}
                </Link>
                <Link href="/team" className={styles.card}>
                    {t("header.teams")}
                </Link>
                <Link href="/match" className={styles.card}>
                    {t("header.matches")}
                </Link>

                {!loggedInUser && (
                    <Link
                        href="/login"
                        className={styles.card}>
                        {t("header.login")}
                    </Link>
                )}

                {loggedInUser && (
                    <>
                        {/* <Link href="/training" className={styles.card}>
                            Trainings
                        </Link>
                        <Link href="/team" className={styles.card}>
                            Teams
                        </Link>
                        <Link href="/match" className={styles.card}>
                            Matches
                        </Link> */}
                                
                        <a
                            href="#"
                            onClick={handleClick}
                            className={styles.card}
                        > {t("header.logout")} </a>
                        <a
                            href="/user"
                            className={styles.card}
                        > {t("header.profile")} </a>
                    </>
                )}

            </nav>
        </header>
    )
}

export default Header;