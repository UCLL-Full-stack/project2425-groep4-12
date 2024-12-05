import Head from "next/head";
import UserLoginForm from "@components/user/UserLoginForm";
import { useState, useEffect } from "react";
import Header from "@components/Header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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