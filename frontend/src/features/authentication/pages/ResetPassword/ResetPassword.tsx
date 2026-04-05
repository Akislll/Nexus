import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { request } from "../../../../utils/api";
import { Box } from "../../components/Box/Box";
import classes from "./ResetPassword.module.scss";

export function ResetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  usePageTitle("Reset Password");

  const sendPasswordResetToken = async (email: string) => {
    await request<void>({
      endpoint: `/api/v1/authentication/send-password-reset-token?email=${email}`,
      method: "PUT",
      onSuccess: () => {
        setErrorMessage("");
        setEmailSent(true);
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
  };

  const resetPassword = async (email: string, code: string, password: string) => {
    await request<void>({
      endpoint: `/api/v1/authentication/reset-password?email=${email}&token=${code}&newPassword=${password}`,
      method: "PUT",
      onSuccess: () => {
        setErrorMessage("");
        navigate("/authentication/login");
      },
      onFailure: (error) => {
        setErrorMessage(error);
      },
    });
  };

  return (
    <div className={classes.root}>
      <Box>
        <h1>Reset Password</h1>

        {!emailSent ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);

              const form = e.currentTarget as HTMLFormElement & {
                email: HTMLInputElement;
              };

              const enteredEmail = form.email.value;

              try {
                await sendPasswordResetToken(enteredEmail);
                setEmail(enteredEmail);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <p className={classes.description}>
              Enter your email and we&apos;ll send a verification code if it matches an existing
              Nexus account.
            </p>

            <Input
              key="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              onFocus={() => setErrorMessage("")}
            />

            {errorMessage && <p className={classes.error}>{errorMessage}</p>}

            <div className={classes.actions}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Next"}
              </Button>

              <Button
                outline
                type="button"
                onClick={() => {
                  navigate("/");
                }}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);

              const form = e.currentTarget as HTMLFormElement & {
                code: HTMLInputElement;
                password: HTMLInputElement;
              };

              const code = form.code.value;
              const password = form.password.value;

              try {
                await resetPassword(email, code, password);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <p className={classes.description}>
              Enter the verification code we sent to your email and your new password.
            </p>

            <Input
              type="text"
              label="Verification code"
              key="code"
              name="code"
              placeholder="Enter verification code"
              onFocus={() => setErrorMessage("")}
            />

            <Input
              label="New password"
              name="password"
              key="password"
              type="password"
              id="password"
              placeholder="Enter new password"
              onFocus={() => setErrorMessage("")}
            />

            {errorMessage && <p className={classes.error}>{errorMessage}</p>}

            <div className={classes.actions}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Button
                outline
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setErrorMessage("");
                }}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </Box>
    </div>
  );
}