import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img alt={t('page_not_found')} className="img-fluid h-25" src="./404.svg" />
      <h1 className="h4 text-muted">{t('page_not_found')}</h1>
      <p className="text-muted">
        {t('you_can_run')}
        <a href="/">{t('general_page')}</a>
      </p>
    </div>
  );
};

export default Page404;
