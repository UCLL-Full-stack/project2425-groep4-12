import Head from 'next/head';
import Header from '@components/Header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from '@styles/home.module.css';

export default function Home() {

    const {t} = useTranslation();

    return (
        <>
            <Head>
                <title>
                    {t("home.title")}
                </title>
            </Head>
            <Header/>
            <main>

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