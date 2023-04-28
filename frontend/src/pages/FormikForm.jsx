import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import cn from 'classnames';
import { fetchToken } from '../slices/loginSlice.js';
import AuthContext from './Context.jsx';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
});

const FormikForm = () => {
  const dispatch = useDispatch();
  const { loggedIn, logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [storeErrors, setErrors] = useState(useSelector((state) => state.login.message));

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
          setErrors('Неверные имя пользователя или пароль');
        }
      }}
    >
      {({ errors }) => {
        const styleInput = cn('form-control', {
          'is-invalid': storeErrors,
        });
        return (
          <Form className="col-12 col-md-6 mt-3 mt-mb-0">
            <h1 className="text-center mb-4">Войти</h1>
            <div className="form-floating mb-3">
              <Field name="username" className={styleInput} placeholder="Ваш ник" required />
              {errors.username ? (
                <div className="invalid-tooltip">{errors.username}</div>
              ) : null}
              <label htmlFor="username">Ваш ник</label>
            </div>
            <div className="form-floating mb-4">
              <Field name="password" type="password" className={styleInput} placeholder="Пароль" required />
              {errors.password ? <div className="invalid-tooltip">{errors.password}</div> : null}
              {storeErrors && !errors.password && <div className="invalid-tooltip">{storeErrors}</div>}
              <label htmlFor="password">Пароль</label>
            </div>
            <button className="w-100 mb-3 btn btn-outline-primary" type="submit">Войти</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormikForm;
