const { signup: signupService, login: loginService } = require('../services/authService');
const { success, failure } = require('../utils/response');
const { connect } = require('../db/mongoose');

module.exports.signup = async (event) => {
  try {
    await connect();
    const body = event.body ? JSON.parse(event.body) : {};

    const result = await signupService(body);
    
    return success(result);
  } catch (error) {
    console.error('Signup error:', error.message || error);
    return failure(error.message || 'Signup failed', 400);
  }
};

module.exports.login = async (event) => {
  try {
    await connect();
    const body = event.body ? JSON.parse(event.body) : {};
    const { email, password } = body;
    const result = await loginService({ email, password });
    return success(result);
  } catch (error) {
    console.error('Login error:', error.message || error);
    return failure(error.message || 'Login failed', 401);
  }
};
