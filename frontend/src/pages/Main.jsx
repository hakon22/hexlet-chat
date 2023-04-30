import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { actions, fetchLoading } from '../slices/loadingSlice.js';

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const username = window.localStorage.getItem('username');
  const { channels, messages, currentChannelId } = useSelector((state) => state.loading);
  const [messageValue, setMessage] = useState('');
  const input = useRef(null);
  // const chatRef = useRef(null);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) navigate('/login');
    dispatch(fetchLoading(token));
    input.current.focus();
    // chatRef.scrollTop = chatRef.scrollHeight;
    // window.scrollTo(0, chatRef.scrollHeight);
  }, [dispatch, navigate]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('channels')}</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => {
              const style = cn('w-100 rounded-0 text-start btn', {
                'btn-secondary': channel.id === currentChannelId,
              });
              return (
                <li key={channel.id} className="nav-item w-100">
                  <button type="button" className={style}>
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  {channels.map((channel) => {
                    if (channel.id === currentChannelId) return `# ${channel.name}`;
                    return null;
                  }).join('')}
                </b>
              </p>
              <span className="text-muted">0 сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              {messages.length > 0 && messages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username}</b>
                  :
                  {' '}
                  {message.body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  const socket = io();
                  const mes = { body: messageValue, channelId: currentChannelId, username };
                  socket.emit('newMessage', mes);
                  socket.on('newMessage', (data) => dispatch(actions.addMessage(data)));
                  setMessage('');
                }}
                className="py-1 border rounded-2"
              >
                <div className={cn('input-group', {
                  'has-validation': !messageValue,
                })}
                >
                  <input
                    ref={input}
                    onChange={(e) => setMessage(e.target.value)}
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    value={messageValue}
                  />
                  <button type="submit" className="btn btn-group-vertical border-0" disabled={!messageValue}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">Отправить</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
