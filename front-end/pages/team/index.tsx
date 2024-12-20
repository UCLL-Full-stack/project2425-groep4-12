import Header from "@components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css"
import useInterval from "use-interval";

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Team } from "@types";
import TeamOverview from "@components/team/TeamOverview";
import TeamService from "@services/TeamService";

const TeamPage: React.FC = () => {
    
    const [teams, setTeams] = useState<Array<Team>>();

    useEffect(() => {
        TeamService.getAllTeams()
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error("Error fetching teams:", error));
    }, []);

    return (
        <>
            <Head>
                <title>Teams</title>
            </Head>
            <Header />
            <main>
                <h1 className={styles.subtitle}>List of teams</h1>
                <section>
                    {teams && (
                        <TeamOverview teams={teams} setTeams={setTeams}/>
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