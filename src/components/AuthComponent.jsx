import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Space,
  Title,
  PasswordInput,
  Anchor,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';

const AuthComponent = () => {
  const [type, setType] = useState('login');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.length > 5,
    },
  });

  const runSignUp = () => {
    chrome.runtime.sendMessage(
      {
        command: type,
        data: {
          email: form.values.email,
          password: form.values.password,
        },
      },
      (resp) => {
        console.log(resp.user);
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
      <Title order={2} align='center'>
        {type === 'login' ? 'Login to continue' : 'Sign Up Today'}
      </Title>
      <Space h='xl' />
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
            form.errors.password && 'Password must be longer than 6 characters'
          }
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue('password', event.currentTarget.value)
          }
        />
        <Space h='md' />
        <Button type='submit' fullWidth color='indigo'>
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
