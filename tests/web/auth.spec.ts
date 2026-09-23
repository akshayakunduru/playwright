import { test, expect } from '../../basetest';
import { generateRandomUser, demoblazeData } from '../../test-data/demoblazeData';

test.describe('DemoBlaze auth', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('signup with a new user', async ({ authModal }) => {
    const newUser = generateRandomUser();
    const alertMessage = await authModal.signup(newUser.username, newUser.password);
    expect(alertMessage).toBe('Sign up successful.');
  });

  test('login and logout', async ({ authModal, homePage }) => {
    const user = generateRandomUser();
    const signupAlert = await authModal.signup(user.username, user.password);
    expect(signupAlert).toBe('Sign up successful.');
    await authModal.login(user.username, user.password);
    const welcome = await homePage.getWelcomeMessage();
    expect(welcome).toContain(`Welcome ${user.username}`);
    await homePage.logout();
    expect(await homePage.isLoggedIn()).toBe(false);
  });

  test('login with a user that does not exist', async ({ authModal }) => {
    const { nonExistentUser, wrongPassword } = demoblazeData.invalidLogin;
    const alertMessage = await authModal.loginExpectingFailure(nonExistentUser, wrongPassword);
    expect(alertMessage).toBe('User does not exist.');
  });

  test('login with the wrong password', async ({ authModal }) => {
    const user = generateRandomUser();
    await authModal.signup(user.username, user.password);
    const alertMessage = await authModal.loginExpectingFailure(user.username, 'WrongPass123!');
    expect(alertMessage).toBe('Wrong password.');
  });

  test('signup with empty fields', async ({ authModal }) => {
    const alertMessage = await authModal.signup('', '');
    expect(alertMessage).toBe('Please fill out Username and Password.');
  });
});
