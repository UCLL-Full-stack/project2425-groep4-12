import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';
import styles from "../../styles/Home.module.css"


const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const {t} = useTranslation();

    const handleLanguageChange = (event: { target: { value: string }}) => {
        const newLocale = event.target.value;
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <a className={styles.card}>
            <label htmlFor="language">
                {t("language.language")}
            </label>
            <select
                id="language"
                className={styles.lang_select}
                value={locale}
                onChange={handleLanguageChange}
            >
                <option value="en">{t("language.en")}</option>
                <option value="nl">{t("language.nl")}</option>
            </select>
        </a>
    );
};

export default Language;