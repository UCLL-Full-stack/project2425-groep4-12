import Head from "next/head";
import UserLoginForm from "@components/user/UserLoginForm";
import { useState, useEffect } from "react";
import Header from "@components/Header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from '@styles/home.module.css';

const Login: React.FC = () => {

    const {t} = useTranslation();

    return (
        <>
            <Head>
            <title>{t("login.title")}</title>
            </Head>
            <Header />
            <main>
                <section>
                    <UserLoginForm />
                </section>
                <div className={styles.tableDiv}>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th scope="col">{t("login.table.firstname")}</th>
                                <th scope="col">{t("login.table.lastname")}</th>
                                <th scope="col">{t("login.table.password")}</th>
                                <th scope="col">{t("login.table.role")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Admin</td>
                                <td>Adrie</td>
                                <td>adrie123</td>
                                <td>ADMIN</td>
                            </tr>
                            <tr>
                                <td>Coach</td>
                                <td>Chris</td>
                                <td>chris123</td>
                                <td>COACH</td>
                            </tr>
                            <tr>
                                <td>Player</td>
                                <td>Pascal</td>
                                <td>pascal123</td>
                                <td>PLAYER</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = async (context: { locale: any }) => {
    const {locale} = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
};

export default Login;