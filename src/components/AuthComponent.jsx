import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Space,
  Title,
  PasswordInput,
  Anchor,
  Container,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';

const AuthComponent = (props) => {
  const [type, setType] = useState('login');
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.length > 7,
      confirmPassword: (value) =>
        type === 'signup' ? value === form.values.password : true,
    },
  });

  const runSignUp = (values) => {
    console.log('Received request');
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      {error && (
        <Alert
          withCloseButton
          closeButtonLabel='Close alert'
          title='Bummer!'
          color='red'
          onClose={() => setError(false)}
          my={3}
        >
          {errorMessage}
        </Alert>
      )}
      <Title order={2} align='center'>
        {type === 'login' ? 'Login to continue' : 'Sign Up Today'}
      </Title>
      <Space h='xl' />
      <form onSubmit={form.onSubmit((values) => runSignUp(values))}>
        <TextInput
          required
          label='Email'
          error={form.errors.email && 'Please specify valid email'}
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue('email', event.currentTarget.value)
          }
          placeholder='you@example.com'
        />
        <Space h='md' />
        <PasswordInput
          placeholder='Password'
          label='Password'
          required
          error={
            form.errors.password && 'Password must be longer than 7 characters'
          }
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue('password', event.currentTarget.value)
          }
        />
        <Space h='md' />
        {type === 'signup' && (
          <>
            <PasswordInput
              placeholder='Password'
              label='Confirm Password'
              required
              error={form.errors.confirmPassword && 'Passwords do not match'}
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue('confirmPassword', event.currentTarget.value)
              }
            />
            <Space h='md' />
          </>
        )}
        <Button type='submit' fullWidth color='indigo' loading={authenticating}>
          {type === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Space h='lg' />
      <Anchor
        color='blue'
        onClick={() => setType(type === 'login' ? 'signup' : 'login')}
      >
        {' '}
        {type === 'login'
          ? "Don't have an account? Sign Up"
          : 'Already have an account? Login'}
      </Anchor>
    </Container>
  );
};

export default AuthComponent;
