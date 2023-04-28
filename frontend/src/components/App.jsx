import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useState, useMemo } from 'react';
import Page404 from '../pages/Page404.jsx';
import Login from '../pages/Login.jsx';
import Main from '../pages/Main.jsx';
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
    <>
      <div className="d-flex flex-column h-100">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <a className="navbar-brand" href="/">Hexlet Chat</a>
          </div>
        </nav>
        <Provider store={store}>
          <AuthContext.Provider value={authServices}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </BrowserRouter>
          </AuthContext.Provider>
        </Provider>
      </div>
      <div className="Toastify" />
    </>
  );
};

export default App;
