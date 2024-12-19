import Header from "@components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css"
import useInterval from "use-interval";

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Match } from "@types";

const MatchPage: React.FC = () => {

    const [matches, setMatches] = useState<Array<Match>>();

    return (
        <>
            <Header />
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

export default MatchPage;