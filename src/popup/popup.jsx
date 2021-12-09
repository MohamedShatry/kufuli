import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Container, MantineProvider } from '@mantine/core';
import AuthComponent from '../components/AuthComponent';
import MainComponent from '../components/MainComponent';

export const Popup = () => {
  const [user, setUser] = useState(false);
  const [revalidate, setRevalidate] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        command: 'isLoggedIn',
      },
      (resp) => {
        setUser(resp.user);
      }
    );
  }, [revalidate]);

  const runRevalidate = () => {
    setRevalidate(!revalidate);
  };
  return (
    <MantineProvider
      theme={{
        primaryColor: 'indigo',
      }}
    >
      <Container style={{ flexGrow: 1, display: 'flex' }}>
        {user ? (
          <MainComponent revalidate={runRevalidate} />
        ) : (
          <AuthComponent revalidate={runRevalidate} />
        )}
      </Container>
    </MantineProvider>
  );
};

render(<Popup />, document.getElementById('popup'));
