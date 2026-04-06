import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/Button/Button.tsx";
import { Input } from "../../../../components/Input/Input.tsx";
import { Loader } from "../../../../components/Loader/Loader.tsx";
import { usePageTitle } from "../../../../hooks/usePageTitle.tsx";
import { Box } from "../../components/Box/Box";
import { Seperator } from "../../components/Seperator/Seperator";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider.tsx";
import { useOauth } from "../../hooks/useOauth.ts";
import classes from "./Signup.module.scss";

export function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthentication();
  const navigate = useNavigate();

  const {isOauthInProgress} = useOauth("signup");

  


  usePageTitle("Sign up");

  const doSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget as HTMLFormElement & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const email = form.email.value;
    const password = form.password.value;

    try {
      await signup(email, password);
      navigate("/");
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
        <h1>Sign up</h1>
        <p>Build your presence, share insights, and grow your circle on Nexus.</p>

        <form onSubmit={doSignup}>
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="Enter your email"
            onFocus={() => setErrorMessage("")}
          />

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="Create a password"
            onFocus={() => setErrorMessage("")}
          />

          {errorMessage && <p className={classes.error}>{errorMessage}</p>}

          <p className={classes.disclaimer}>
            By clicking <strong>Agree & Join</strong> or <strong>Continue</strong>, you agree to
            Nexus&apos;s <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{" "}
            <a href="">Cookie Policy</a>.
          </p>

          <Button disabled={isLoading} type="submit">
            {isLoading ? "Creating account..." : "Agree & Join"}
          </Button>
        </form>

        <Seperator>Or</Seperator>

        

        <div className={classes.register}>
          Already on Nexus? <Link to="/authentication/login">Sign in</Link>
        </div>
      </Box>
    </div>
  );
}
