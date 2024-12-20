import Header from "@components/Header";
import Head from "next/head";
import { useState, useEffect } from "react";
import useInterval from "use-interval";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Event } from "@types";
import EventOverview from "@components/event/EventOverview";
import EventService from "@services/EventService";

type Props = {
  events: Event[];
}

const EventPage: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(t("event.error"));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useInterval(fetchEvents, 5000);

  return (
    <>
      <Head>
        <title className="">{t("event.title")}</title>
      </Head>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <h1 className="center-text text-2xl font-bold mt-8">
          {t("event.h1")}
        </h1>
        <section className="w-full max-w-4xl mt-6">
          {error && (
            <p className="text-red-600 text-center">{error}</p>
          )}
          {events.length > 0 ? (
            <EventOverview events={events} refreshEvents={fetchEvents} />
          ) : (
            <p className="text-gray-600 text-center mt-4">
              {t("event.noEvents")}
            </p>
          )}
        </section>
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default EventPage;
