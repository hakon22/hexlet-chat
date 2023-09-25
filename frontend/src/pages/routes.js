const apiPath = '/chat/api';

export default {
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  data: [apiPath, 'data'].join('/'),
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
};
