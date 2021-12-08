import React, { useState } from 'react';
import { Container, SegmentedControl } from '@mantine/core';
import PasswordGenerator from './PasswordGenerator';

function MainComponent(props) {
  const [value, setValue] = useState('domain');
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        textAlign: 'center',
        padding: '3%',
      }}
    >
      <SegmentedControl
        value={value}
        onChange={setValue}
        mt={3}
        data={[
          { label: 'Domain', value: 'domain' },
          { label: 'Vault', value: 'vault' },
          { label: 'Generator', value: 'generator' },
        ]}
      />
      {value === 'generator' && <PasswordGenerator />}
    </Container>
  );
}

export default MainComponent;
