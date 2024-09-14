
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import {  useAuthState } from "react-firebase-hooks/auth";
import {  registerWithEmailAndPassword } from "../firebase";
import { NextIntlClientProvider } from "next-intl";
import Register from "../components/auth/Register/Register";
import { useRouter } from 'next/navigation';

jest.mock("../firebase", () => ({
  auth: jest.fn(),
  registerWithEmailAndPassword: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(() => [null, false]),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(), 
    useParams: jest.fn(),
  }));

  global.matchMedia = global.matchMedia || function() {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  };

  describe("Register component", () => {
    const locale = "en";
    const messages = require(`../../messages/${locale}.json`);

    beforeEach(() => {  
        jest.resetAllMocks();    
    });

    it('should handle form submission with valid input', async () => {
        const mockUser = null; 
        const mockLoading = false; 
        require('react-firebase-hooks/auth').useAuthState.mockReturnValue([mockUser, mockLoading]);

        render(
            <NextIntlClientProvider messages={messages} locale={locale}>
              <Register />
            </NextIntlClientProvider>
          );

    const nameInput = screen.getByPlaceholderText(messages["Register"]["name"]);
    const emailInput = screen.getByPlaceholderText (messages["Register"]["email"]);
    const passwordInput = screen.getByPlaceholderText(messages["Register"]["password"]);

    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByText(messages["Register"]["register"]);

    await act (async() => {
        fireEvent.click(submitButton);
      });

     expect(registerWithEmailAndPassword).toHaveBeenCalledTimes(1);

      await waitFor(() => {
         expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
          'John Doe', 'john@example.com', 'Password123!'
        );
      });
  });

  it('should show validation errors for invalid input', async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, false]);

    render(
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Register />
        </NextIntlClientProvider>
      );
    const submitButton = screen.getByText(messages["Register"]["register"]);

    await act (async() => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
    expect(screen.getByText(messages["Register"]["name-error"])).toBeInTheDocument();
    expect(screen.getByText(messages["Register"]["email-error"])).toBeInTheDocument();
    expect(screen.getByText(messages["Register"]["password-error"])).toBeInTheDocument();
  });


  });

  it('should display spinner while loading', () => {
    (useAuthState as jest.Mock).mockReturnValue([null, true]); 

    const { container } = render(
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Register />
        </NextIntlClientProvider>
      );
      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
  });

  it('should not perform actions while loading', async () => {
    (useAuthState as jest.Mock).mockReturnValue([null, true]); 

    const mockPush = jest.fn();
    const useRouter = jest.fn()
    useRouter.mockReturnValue({ push: mockPush });

    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Register />
      </NextIntlClientProvider>
    );

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('should navigate to the user`s locale when user is authenticated', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush, 
    }));

    const mockUser = { uid: 'test-user' };
    act(() => { 
        (useAuthState as jest.Mock).mockReturnValue([mockUser, false]); 
    });

     await act(async () => {
      render(
        <NextIntlClientProvider messages={messages} locale="en">
          <Register />
        </NextIntlClientProvider>
      );
    });

    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith(`/en`);
      });
   
    expect(useAuthState).toHaveBeenCalled();
    expect((useAuthState as jest.Mock).mock.results[0].value[0]).toEqual(mockUser);

  });

  });
