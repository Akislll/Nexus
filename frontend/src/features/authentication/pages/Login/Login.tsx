import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { Loader } from "../../../../components/Loader/Loader";
import { usePageTitle } from "../../../../hooks/usePageTitle";
import { Box } from "../../components/Box/Box";
import { Seperator } from "../../components/Seperator/Seperator";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { useOauth } from "../../hooks/useOauth";
import classes from "./Login.module.scss";

export function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthentication();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOauthInProgress } = useOauth("login");
  usePageTitle("Sign in");

  const doLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget as HTMLFormElement & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const email = form.email.value;
    const password = form.password.value;

    try {
      await login(email, password);
      const destination = location.state?.from || "/";
      navigate(destination);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isOauthInProgress) {
    return <Loader isInline />;
  }

  return (
    <div className={classes.root}>
      <Box>
        <h1>Sign in</h1>
        <p>Enter Nexus and continue building your circle.</p>

        <form onSubmit={doLogin}>
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            onFocus={() => setErrorMessage("")}
          />

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            onFocus={() => setErrorMessage("")}
          />

          {errorMessage && <p className={classes.error}>{errorMessage}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Link to="/authentication/request-password-reset">Forgot password?</Link>
        </form>

        <Seperator>Or</Seperator>

        <div className={classes.register}>
          

          

          New to Nexus? <Link to="/authentication/signup">Join now</Link>
        </div>
      </Box>
    </div>
  );
}
