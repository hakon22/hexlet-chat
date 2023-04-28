import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectors } from '../slices/loginSlice.js';

const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  return (
    <div className="h-100">
      Main
    </div>
  );
};

export default Main;
