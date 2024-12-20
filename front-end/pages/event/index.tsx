import Header from "@components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../../styles/home.module.css"
import useInterval from "use-interval";

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Event } from "@types";
import EventOverview from "@components/event/EventOverview"
import EventService from "@services/EventService";

const EventPage: React.FC = () => {
    
    const {t} = useTranslation();

    const [events, setEvents] = useState<Array<Event>>();

    const getEvents = async () => {
        const response = await EventService.getAllEvents();
        const events = await response.json();
        setEvents(events);
    }

    useEffect(() => {
        getEvents()
    }, [])

    useInterval(getEvents, 5000)

    return (
        <>
            <Head>
                <title>
                    {t("event.title")}
                </title>
            </Head>
            <Header />
            <main>
                <h1 className={styles.subtitle}>{t("event.h1")}</h1>
                <section>
                    {events && (
                        <EventOverview events={events}/>
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

export default EventPage;