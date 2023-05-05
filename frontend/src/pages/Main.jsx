import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchLoading, actions } from '../slices/loadingSlice.js';
import ModalAdd, { ModalDelete, ModalRename } from '../components/ModalF.jsx';

const Main = ({ api }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const username = window.localStorage.getItem('username');
  const {
    channels,
    messages,
    currentChannelId,
    loadingStatus,
  } = useSelector((state) => state.loading);
  const [messageValue, setMessage] = useState('');
  const input = useRef();
  const chatRef = useRef();
  const channelsRef = useRef();

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) navigate('/login');
    dispatch(fetchLoading(token));
  }, [dispatch, navigate]);

  useEffect(() => {
    input.current.focus();
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    channelsRef.current.scrollIntoView();
  }, [messages.length, currentChannelId]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('channels')}</b>
            <ModalAdd api={api} />
          </div>
          <ul ref={channelsRef} id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((channel) => {
              const style = cn('w-100 rounded-0 text-start btn', {
                'btn-secondary': channel.id === currentChannelId,
                'border-0': true,
              });
              return (
                <li ref={channel.id === currentChannelId ? channelsRef : null} key={channel.id} className="nav-item w-100">
                  {channel.removable ? (
                    <div role="group" className="d-flex dropdown btn-group">
                      <button onClick={() => dispatch(actions.changeChannel(channel.id))} type="button" className={style}>
                        <span className="me-1">#</span>
                        {channel.name}
                      </button>
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          split
                          variant={cn('flex-grow-0 dropdown-toggle dropdown-toggle-split btn border-0', {
                            'btn-secondary': channel.id === currentChannelId,
                          })}
                          id="dropdown-split-basic"
                        />
                        <Dropdown.Menu
                          id={`dropdown-button-drop-${channel.id}`}
                          size="sm"
                          variant="secondary"
                        >
                          <ModalDelete api={api} t={t} id={channel.id} />
                          <ModalRename api={api} t={t} id={channel.id} name={channel.name} />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  ) : (
                    <button onClick={() => dispatch(actions.changeChannel(channel.id))} type="button" className={style}>
                      <span className="me-1">#</span>
                      {channel.name}
                    </button>
                  )}
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
              <span className="text-muted">{t('count_message', { count: messages.filter((mes) => mes.channelId === currentChannelId).length })}</span>
            </div>
            <div ref={chatRef} id="messages-box" className="chat-messages overflow-auto px-5 ">
              {messages.length > 0 && messages.map((message) => {
                if (message.channelId === currentChannelId) {
                  return (
                    <div key={message.id} className="text-break mb-2">
                      {username === message.username ? <b>{message.username}</b> : message.username}
                      :
                      {' '}
                      {message.body}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className="mt-auto px-5 py-3">
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  const mes = { body: messageValue.trim(), channelId: currentChannelId, username };
                  api.sendMessage(mes);
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
                    aria-label={t('new_message')}
                    placeholder={t('input_message')}
                    className="border-0 p-0 ps-2 form-control"
                    value={messageValue}
                  />
                  <button type="submit" className="btn btn-group-vertical border-0" disabled={!messageValue || loadingStatus === 'loading'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">{t('post')}</span>
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
