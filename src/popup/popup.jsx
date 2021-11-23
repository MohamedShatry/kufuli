import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  Container,
  MantineProvider,
  TextInput,
  Button,
  Space,
  Title,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';

const SignUpComponent = () => {
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
        command: 'signup',
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
        Sign Up Today
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
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export const Popup = () => {
  const [user, setUser] = useState();

  return (
    <MantineProvider theme={{ fontFamily: 'Avenir' }}>
      <Container style={{ flexGrow: 1, display: 'flex' }}>
        <SignUpComponent />
      </Container>
    </MantineProvider>
  );
};

render(<Popup />, document.getElementById('popup'));
