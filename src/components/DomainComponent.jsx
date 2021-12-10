import React, { useState, useEffect } from 'react';
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  Input,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Transition,
  ScrollArea,
} from '@mantine/core';
import { useClickOutside, useClipboard, useForm } from '@mantine/hooks';
import {
  EyeOpenIcon,
  EyeNoneIcon,
  ClipboardIcon,
  PlusIcon,
} from '@modulz/radix-icons';

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const NewCredentialForm = (props) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      domain: props.domain,
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.length > 7,
      domain: (value) => isValidHttpUrl(value),
    },
  });

  const runRegisterCredential = (values) => {
    setAuthenticating(true);
    chrome.runtime.sendMessage(
      {
        command: 'registerCredential',
        data: {
          email: values.email,
          password: values.password,
          domain: values.domain,
        },
      },
      (resp) => {
        if (resp.error) {
          setError(true);
          setErrorMessage(resp.errorMessage);
        } else {
          setSuccess(resp.message);
        }
        setAuthenticating(false);
      }
    );
  };

  return (
    <Container
      styles={{
        height: '100%',
        width: '100%',
        margin: 0,
      }}
    >
      <form onSubmit={form.onSubmit((values) => runRegisterCredential(values))}>
        <TextInput
          required
          label='Domain'
          value={form.values.domain}
          onChange={(event) =>
            form.setFieldValue('domain', event.currentTarget.value)
          }
          placeholder='https://example.com'
        />
        <Space h='md' />
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
        <Button type='submit' fullWidth color='indigo' loading={authenticating}>
          Register
        </Button>
      </form>
    </Container>
  );
};

const RightSection = (props) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <>
      <ActionIcon onClick={props.updateHidden}>
        {!props.isHidden && <EyeOpenIcon color='black' />}
        {props.isHidden && <EyeNoneIcon color='black' />}
      </ActionIcon>
      <ActionIcon onClick={() => clipboard.copy(props.value)}>
        <ClipboardIcon color='black' />
      </ActionIcon>
    </>
  );
};

function DomainComponent(props) {
  const [creds, setCreds] = useState(props.creds);
  const [localURL, setLocalURL] = useState('');
  const [domainValues, setDomainValues] = useState([]);
  const [hidden, setIsHidden] = useState(true);
  const [open, setOpen] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpen(false));

  const updateHidden = () => {
    setIsHidden(!hidden);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      setLocalURL(url);
      if (url) {
        const localDomains = creds.filter((cred) =>
          url.toLowerCase().includes(cred.domain.toLowerCase())
        );
        setDomainValues(localDomains);
      }
    });
  }, []);

  return (
    <>
      <Space mt={4} />
      <Button
        leftIcon={<PlusIcon style={{ width: 16, height: 16 }} />}
        variant='default'
        onClick={() => setOpen(true)}
      >
        Add Credentials
      </Button>

      <Space mt={4} />
      <ScrollArea style={{ width: '100%', height: '85%' }}>
        <Accordion>
          {domainValues.map((cred, index) => {
            return (
              <Accordion.Item label={cred.domain}>
                <Box>
                  <Text align='left' color='gray' size='sm'>
                    {cred.email}
                  </Text>
                  <Space mt={2} />
                  <Input
                    value={cred.password}
                    type={hidden ? 'password' : 'text'}
                    rightSection={
                      <RightSection
                        isHidden={hidden}
                        updateHidden={updateHidden}
                        value={cred.password}
                      />
                    }
                    styles={{
                      rightSection: { right: '5%' },
                    }}
                  />
                </Box>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </ScrollArea>
      {domainValues.length === 0 && (
        <Text> You don't have any credentials saved on this URL</Text>
      )}

      <Transition
        mounted={open}
        transition={'slide-up'}
        duration={300}
        timingFunction='ease'
      >
        {(styles) => (
          <Paper
            shadow='lg'
            style={{
              ...styles,
              position: 'absolute',
              bottom: 0,
              left: 15,
              right: 15,
              height: 350,
              background: 'white',
            }}
            ref={clickOutsideRef}
          >
            <NewCredentialForm domain={localURL} />
          </Paper>
        )}
      </Transition>
    </>
  );
}

export default DomainComponent;
