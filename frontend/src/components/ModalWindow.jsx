import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { channelNameValidation } from '../validations/validations.js';

export const ModalAdd = ({ api }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const { channels, loadingStatus } = useSelector((state) => state.loading);
  const channelsName = channels.map((channel) => channel.name);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: channelNameValidation(channelsName),
    onSubmit: (name, { setSubmitting, resetForm }) => {
      api.createChannel(name);
      setSubmitting(false);
      resetForm();
      handleClose();
    },
  });

  return (
    <>
      <button onClick={handleShow} type="button" className="p-0 text-primary btn btn-group-vertical">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="visually-hidden">+</span>
      </button>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          formik.values.name = '';
          formik.errors.name = '';
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('add_channel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={formik.handleSubmit}
          >
            <Form.Group controlId="newChannel">
              <Form.Label className="visually-hidden">ChannelName</Form.Label>
              <Form.Control
                className="mb-2"
                onChange={formik.handleChange}
                value={formik.values.name}
                autoFocus
                disabled={loadingStatus === 'loading' || formik.isSubmitting}
                isInvalid={formik.errors.name && formik.touched.name}
                onBlur={formik.handleBlur}
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.name)}
              </Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  variant="secondary"
                  onClick={() => {
                    handleClose();
                    formik.values.name = '';
                    formik.errors.name = '';
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button variant="primary" type="submit" disabled={loadingStatus === 'loading' || formik.isSubmitting}>
                  {t('post')}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const ModalRename = ({
  api, t, id, curChName,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const input = useRef();
  const { channels, loadingStatus } = useSelector((state) => state.loading);
  const channelsName = channels.map((channel) => channel.name);

  const formik = useFormik({
    initialValues: {
      name: curChName,
    },
    validationSchema: channelNameValidation(channelsName),
    onSubmit: ({ name }, { setSubmitting }) => {
      api.renameChannel({ name, id });
      handleClose();
      formik.errors.name = '';
      setSubmitting(false);
    },
  });

  return (
    <>
      <Button type="button" className="dropdown-item" onClick={handleShow}>{t('rename')}</Button>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          formik.errors.name = '';
        }}
        centered
        onShow={() => input.current.select()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('rename_channel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={formik.handleSubmit}
          >
            <Form.Group controlId="input">
              <Form.Label className="visually-hidden">ChannelRename</Form.Label>
              <Form.Control
                autoFocus
                ref={input}
                className="mb-2"
                onChange={formik.handleChange}
                value={formik.values.name}
                disabled={loadingStatus === 'loading' || formik.isSubmitting}
                isInvalid={formik.errors.name && formik.touched.name}
                onBlur={formik.handleBlur}
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                {t(formik.errors.name)}
              </Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  variant="secondary"
                  onClick={() => {
                    handleClose();
                    formik.errors.name = '';
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button variant="primary" type="submit" disabled={loadingStatus === 'loading' || formik.isSubmitting}>
                  {t('post')}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const ModalDelete = ({
  api, t, id,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Dropdown.Item onClick={handleShow}>{t('delete')}</Dropdown.Item>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('delete_channel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{t('realy')}</p>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                api.removeChannel({ id });
                handleClose();
              }}
            >
              {t('delete')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
