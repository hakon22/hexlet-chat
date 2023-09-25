import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './Context.jsx';
import routes from '../pages/routes.js';

const Nav = () => {
  const { t } = useTranslation();
  const { logOut } = useContext(AuthContext);
  const auth = useSelector((state) => state.loading.channels.length);
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={routes.homePage}>{t('name_link_chat')}</Link>
        {auth > 0 && (
        <button
          type="button"
          onClick={() => {
            logOut();
            window.location.href = '/chat/login';
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
