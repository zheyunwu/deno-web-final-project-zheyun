import * as authService from "../../services/authService.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

// Login
const showLogin = async({render}) => {
  render('auth/login.ejs', {email: '', error: null});
}

const handleLogin = async({request, response, session, render}) => {
  const form = await request.body().value;
  const email = form.get('email');
  const password = form.get('password');

  if (!email.includes('@') || !email.includes('.')) {
    response.status = 400;
    render('auth/login.ejs', { email: '', error: 'Email format inccorect'});
    return;
  }

  if (password.length < 4) {
    response.status = 400;
    render('auth/login.ejs', { email: '', error: 'Password must contain at least 4 characters'});
    return;
  }
  
  const res = await authService.searchUser(email);

  if (res.rowCount === 0) {
    response.status = 401;
    render('auth/login.ejs', { email: '', error: 'Invalid email or password'});
    return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const passwordCorrect = await bcrypt.compare(password, userObj.password);
  if (!passwordCorrect) {
    response.status = 401;
    render('auth/login.ejs', { email: '', error: 'Invalid email or password'});
    return;
  }

  await session.set('loggedin', true);
  await session.set('user', {
    id: userObj.id,
    email: userObj.email
  });
  // response.body = 'Authentication successful!';
  response.redirect('/');
}

// Log out
const handleLogout = async({response, session}) => {
  await session.set('loggedin', false);
  await session.set('user', null);
  response.redirect('/');
}

// Register
const showRegister = async({render}) => {
  render('auth/register.ejs', {email: '', error: null});
}

const handleRegister = async({request, response, render}) => {
  const form = await request.body().value;
  
  const email = form.get('email');
  const password = form.get('password');
  const verification = form.get('verification');

  if (!email.includes('@') || !email.includes('.')) {
    response.status = 400;
    render('auth/register.ejs', { email: email, error: 'Email format inccorect'});
    return;
  }

  if (password.length < 4) {
    response.status = 400;
    render('auth/register.ejs', { email: email, error: 'Password must contain at least 4 characters'});
    return;
  }

  if (password !== verification) {
    render('auth/register.ejs', { email: email, error: 'Two passwords not match'});
    return;
  }

  const existingUsers = await authService.searchUser(email)
  if (existingUsers.rowCount > 0) {
    render('auth/register.ejs', { email: email, error: 'The email has been taken.'});
    return;
  }

  const password_hash = await bcrypt.hash(password);
  await authService.addUser(email, password_hash)

  response.redirect('/auth/login');
}

export { showLogin, handleLogin, handleLogout, showRegister, handleRegister };