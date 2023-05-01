import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import Page404 from '../pages/Page404.jsx';
import Login from '../pages/Login.jsx';
import Main from '../pages/Main.jsx';
import Nav from '../pages/Nav.jsx';
import store from '../slices/index.js';
import AuthContext from '../pages/Context.jsx';
import { actions } from '../slices/loadingSlice.js';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };
  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  const socket = io();

  const socketConnect = (param, arg) => socket.emit(param, arg, (response) => {
    if (response.status !== 'ok') {
      // eslint-disable-next-line no-alert
      alert('ошибка интернет соединения');
    }
  });

  const api = {
    sendMessage: (message) => socketConnect('newMessage', message),
    createChannel: (channel) => socketConnect('newChannel', channel),
    renameChannel: (channel) => socketConnect('renameChannel', channel),
    removeChannel: (channel) => socketConnect('removeChannel', channel),
  };

  socket.on('newMessage', (data) => store.dispatch(actions.addMessage(data)));

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authServices}>
        <div className="d-flex flex-column h-100">
          <Nav />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main api={api} />} />
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
