import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import AuthContext from './Context.jsx';

const Nav = () => {
  const { t } = useTranslation();
  const { logOut } = useContext(AuthContext);
  const auth = useSelector((state) => state.loading.channels.length);
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('name_link_chat')}</a>
        {auth > 0 && (
        <button
          type="button"
          onClick={() => {
            logOut();
            window.location.href = '/login';
          }}
          className="btn btn-primary"
        >
          {t('go_out')}
        </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
