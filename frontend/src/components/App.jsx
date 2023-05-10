import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useState, useMemo } from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import Page404 from '../pages/Page404.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Main from '../pages/Main.jsx';
import Nav from './Nav.jsx';
import store from '../slices/index.js';
import AuthContext from './Context.jsx';
import { actions } from '../slices/loadingSlice.js';

const App = () => {
  const { t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  const socket = io();

  const socketConnect = (param, arg) => socket.emit(param, arg, (response) => {
    if (!response) {
      throw new Error(t('toast.networkErr'));
    }
    if (response.data) {
      store.dispatch(actions.changeChannel(response.data.id));
    }
  });

  const api = {
    sendMessage: (message) => socketConnect('newMessage', message),
    createChannel: (channel) => socketConnect('newChannel', channel),
    renameChannel: (channel) => socketConnect('renameChannel', channel),
    removeChannel: (channel) => socketConnect('removeChannel', channel),
  };

  socket.on('newMessage', (data) => store.dispatch(actions.addMessage(data)));
  socket.on('newChannel', (data) => store.dispatch(actions.addChannel(data)));
  socket.on('renameChannel', (data) => store.dispatch(actions.renameChannel(data)));
  socket.on('removeChannel', (data) => store.dispatch(actions.removeChannel(data)));

  const username = window.localStorage.getItem('username');

  const rollbarConfig = {
    accessToken: 'be22f4fbc46d4f9ab5f9868e1831520f',
    environment: 'testenv',
  };

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authServices}>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <div className="d-flex flex-column h-100">
              <BrowserRouter>
                <Nav />
                <ToastContainer />
                <Routes>
                  <Route path="/" element={username ? <Main api={api} /> : <Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </BrowserRouter>
            </div>
          </ErrorBoundary>
        </RollbarProvider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
