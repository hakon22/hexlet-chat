import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import cn from 'classnames';
import { fetchToken } from '../slices/loginSlice.js';
import AuthContext from './Context.jsx';

const FormikForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loggedIn, logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [storeErrors, setErrors] = useState(useSelector((state) => state.login.message));

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required(t('error_yup')),
    password: Yup.string().required(t('error_yup')),
  });

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn, navigate]);
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values) => {
        const { meta: { requestStatus } } = await dispatch(fetchToken(values));
        if (requestStatus === 'fulfilled') {
          logIn();
        } else {
          setErrors(t('error_auth'));
        }
      }}
    >
      {({ errors }) => {
        const styleInput = cn('form-control', {
          'is-invalid': storeErrors,
        });
        return (
          <Form className="col-12 col-md-6 mt-3 mt-mb-0">
            <h1 className="text-center mb-4">{t('to_come')}</h1>
            <div className="form-floating mb-3">
              <Field autoFocus name="username" className={styleInput} placeholder={t('you_nick')} required />
              {errors.username && <div className="invalid-tooltip">{errors.username}</div>}
              <label htmlFor="username">{t('you_nick')}</label>
            </div>
            <div className="form-floating mb-4">
              <Field name="password" type="password" className={styleInput} placeholder={t('you_pass')} required />
              {errors.password && <div className="invalid-tooltip">{errors.password}</div>}
              {storeErrors && !errors.password && <div className="invalid-tooltip">{storeErrors}</div>}
              <label htmlFor="password">{t('you_pass')}</label>
            </div>
            <button className="w-100 mb-3 btn btn-outline-primary" type="submit">{t('to_come')}</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormikForm;
