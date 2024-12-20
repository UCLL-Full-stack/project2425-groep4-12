import Header from "@components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css"
import useInterval from "use-interval";

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Team } from "@types";
import TeamOverview from "@components/team/TeamOverview";

const TeamPage: React.FC = () => {
    
    const [teams, setTeams] = useState<Array<Team>>();

    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <Header />
            <main>
                <h1>List of teams</h1>
                <section>
                    {teams && (
                        <TeamOverview teams={teams}/>
                    )}
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

export default TeamPage;