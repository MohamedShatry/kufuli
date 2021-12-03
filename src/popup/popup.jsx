import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Container, MantineProvider } from '@mantine/core';
import AuthComponent from '../components/AuthComponent';

export const Popup = () => {
  const [user, setUser] = useState();

  return (
    <MantineProvider
      theme={{
        primaryColor: 'indigo',
      }}
    >
      <Container style={{ flexGrow: 1, display: 'flex' }}>
        <AuthComponent />
      </Container>
    </MantineProvider>
  );
};

render(<Popup />, document.getElementById('popup'));
