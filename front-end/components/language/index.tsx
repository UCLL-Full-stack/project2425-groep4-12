import { useRouter } from "next/router";
import { i18n, useTranslation } from 'next-i18next';
import styles from "../../styles/Home.module.css"


const Language: React.FC = () => {

    const {t} = useTranslation();

    const router = useRouter();
    const { locale, pathname, asPath, query } = router;
  
    const handleLanguageChange = (event: { target: { value: string } }) => {
      const newLocale = event.target.value;
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale: newLocale })
    };

    return (
        <a>
            <label htmlFor="language">
                {t("language.language")}
            </label>
            <select
                id="language"
                className={styles.button2}
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