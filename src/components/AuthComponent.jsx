import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Space,
  Title,
  PasswordInput,
  Anchor,
  Container,
  Alert,
  Progress,
  Text,
  Popover,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Cross1Icon, CheckIcon } from "@modulz/radix-icons";

function getStrength(password) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

// : { meets: boolean; label: string }
function PasswordRequirement({ meets, label }) {
  return (
    <Text
      color={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center", marginTop: 7 }}
      size="sm"
    >
      {meets ? <CheckIcon /> : <Cross1Icon />}{" "}
      <span style={{ marginLeft: 10 }}>{label}</span>
    </Text>
  );
}

const validate = (value) => {
  const arr = requirements.map((requirement, index) =>
    requirement.re.test(value)
  );

  return !arr.includes(false);
};

const AuthComponent = (props) => {
  const [type, setType] = useState("login");
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [popoverOpened, setPopoverOpened] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) =>
        type === "signup" ? validate(value) : value.length > 7,
      confirmPassword: (value) =>
        type === "signup" ? value === form.values.password : true,
    },
  });

  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  const runSignUp = (values) => {
    console.log("Received request");
    setAuthenticating(true);
    chrome.runtime.sendMessage(
      {
        command: type,
        data: {
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
      },
      (resp) => {
        if (resp.error) {
          setError(true);
          setErrorMessage(resp.errorMessage);
        }
        setAuthenticating(false);
        props.revalidate();
      }
    );
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
      }}
    >
      {error && (
        <Alert
          withCloseButton
          closeButtonLabel="Close alert"
          title="Bummer!"
          color="red"
          onClose={() => setError(false)}
          my={3}
        >
          {errorMessage}
        </Alert>
      )}
      <Title order={2} align="center">
        {type === "login" ? "Login to continue" : "Sign Up Today"}
      </Title>
      <Space h="xl" />
      <form onSubmit={form.onSubmit((values) => runSignUp(values))}>
        <TextInput
          required
          label="Email"
          error={form.errors.email && "Please specify valid email"}
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          placeholder="you@example.com"
        />
        {type === "login" && (
          <>
            <Space h="md" />
            <PasswordInput
              placeholder="Password"
              label="Password"
              required
              error={
                form.errors.password &&
                "Password must be longer than 7 characters"
              }
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
            />
            <Space h="md" />
          </>
        )}

        {type === "signup" && (
          <>
            <Space h="md" />
            <Popover
              opened={popoverOpened && !validate(form.values.password)}
              position="bottom"
              placement="start"
              withArrow
              styles={{ popover: { width: "100%" } }}
              noFocusTrap
              transition="pop-top-left"
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
              target={
                <PasswordInput
                  required
                  label="Password"
                  placeholder="Password"
                  description="Strong password should include letters in lower and uppercase, at least 1 number, at least 1 special symbol"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue("password", event.currentTarget.value)
                  }
                />
              }
            >
              <Progress
                color={color}
                value={strength}
                size={5}
                style={{ marginBottom: 10 }}
              />
              <PasswordRequirement
                label="Includes at least 8 characters"
                meets={form.values.password.length > 7}
              />
              {checks}
            </Popover>
            <PasswordInput
              placeholder="Password"
              label="Confirm Password"
              required
              error={form.errors.confirmPassword && "Passwords do not match"}
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue("confirmPassword", event.currentTarget.value)
              }
            />
            <Space h="md" />
          </>
        )}
        <Button type="submit" fullWidth color="indigo" loading={authenticating}>
          {type === "login" ? "Login" : "Sign Up"}
        </Button>
      </form>
      <Space h="lg" />
      <Anchor
        color="blue"
        onClick={() => setType(type === "login" ? "signup" : "login")}
      >
        {" "}
        {type === "login"
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </Anchor>
    </Container>
  );
};

export default AuthComponent;
