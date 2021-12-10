import React, { useState, useEffect } from 'react';
import { Center, Container, Loader, SegmentedControl } from '@mantine/core';
import PasswordGenerator from './PasswordGenerator';
import VaultComponent from './VaultComponent';
import DomainComponent from './DomainComponent';

function MainComponent(props) {
  const [value, setValue] = useState('domain');
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState([]);

  useEffect(() => {
    setLoading(true);
    chrome.runtime.sendMessage(
      {
        command: 'getCredentials',
      },
      (resp) => {
        setCreds(resp.message);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          textAlign: 'center',
          padding: '3%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {' '}
        <Loader />
      </Container>
    );
  }

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
      {value === 'vault' && <VaultComponent creds={creds} />}
      {value === 'domain' && <DomainComponent creds={creds} />}
    </Container>
  );
}

export default MainComponent;
