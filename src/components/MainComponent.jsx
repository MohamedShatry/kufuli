import React from 'react';
import { Container } from '@mantine/core';

function MainComponent() {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      Hello there
    </Container>
  );
}

export default MainComponent;
