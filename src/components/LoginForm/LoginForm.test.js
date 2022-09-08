import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './index';

test('renders sign in page', () => {
  render(<LoginForm />);
  const signInText = screen.getByText("Sign in");
  expect(signInText).toBeInTheDocument();
});

// Add more unit test here
describe("test login with valid credentials", () => {

  test("email input validation", () => {
    render(<LoginForm />)
    const emailField = screen.getByRole('textbox', {
      name: /email address/i
    })
    userEvent.type(emailField, 'email@domain.com')
    expect(require("email-validator").validate(emailField.value)).toBe(true)
  })

  test("password input validation", () => {
    render(<LoginForm />)
    const passwordField = screen.getByLabelText(/password/i)
    userEvent.type(passwordField, 'Password_123')
    expect(require("validator").isStrongPassword(passwordField.value, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })).toBe(true)
  })
})

describe("form validation", () => {
  const onSubmit = jest.fn()

  beforeEach(() => {
    onSubmit.mockClear();
    render(<LoginForm onSubmit={onSubmit} />)
  })

  it("Login when all fields pass validation", async () => {
    const email = screen.getByRole('textbox', {
      name: /email/i
    })
    userEvent.type(email, 'email@domain.com')

    const password = screen.getByLabelText(/password/i)
    userEvent.type(password, 'Password-321')

    const signIn = screen.getByRole("button", {
      name: /sign in/i
    })
    userEvent.click(signIn)

    expect(onSubmit).toHaveBeenCalledTimes(0)
    const loggedIn = screen.getByText(/login successful/i)
    expect(loggedIn).toBeInTheDocument()
  })
})