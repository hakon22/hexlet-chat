import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useState, useMemo } from 'react';
import Page404 from '../pages/Page404.jsx';
import Login from '../pages/Login.jsx';
import Main from '../pages/Main.jsx';
import Nav from '../pages/Nav.jsx';
import store from '../slices/index.js';
import AuthContext from '../pages/Context.jsx';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };
  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);
  return (
    <Provider store={store}>
      <AuthContext.Provider value={authServices}>
        <div className="d-flex flex-column h-100">
          <Nav />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </BrowserRouter>
        </div>
        <div className="Toastify" />
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
