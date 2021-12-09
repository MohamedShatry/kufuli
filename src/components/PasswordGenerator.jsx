import React, { useState, useEffect } from "react";
import {
  Input,
  ActionIcon,
  Container,
  SimpleGrid,
  Checkbox,
  Space,
  NumberInput,
  InputWrapper,
  Button,
} from "@mantine/core";
import { ClipboardIcon } from "@modulz/radix-icons";
import generator from "generate-password-browser";
import { useClipboard } from "@mantine/hooks";

const RightSection = (props) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <ActionIcon onClick={() => clipboard.copy(props.value)}>
      <ClipboardIcon color="black" />
    </ActionIcon>
  );
};

function PasswordGenerator() {
  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0].url;
      console.log("TABS", url);
    });
  }, []);

  const defaultGeneratorOptions = {
    length: 9,
    numbers: true,
    symbols: false,
    lowercase: true,
    uppercase: true,
  };
  const [values, setValues] = useState(defaultGeneratorOptions);
  const defaultPassword = generator.generate(values);
  const [currentPassword, setCurrentPassword] = useState(defaultPassword);

  // const [length, setLength] = useState(6);
  const updateLength = (val) => {
    setValues((oldValues) => ({ ...oldValues, length: val }));
  };
  const updateValues = (id, value) => {
    setValues((oldVals) => ({ ...oldVals, [id]: value }));
  };

  const generateNewPassword = () => {
    const password = generator.generate(values);
    setCurrentPassword(password);
  };
  return (
    <Container
      m={4}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "80vh",
        justifyContent: "center",
      }}
    >
      <InputWrapper label="Your generated password">
        <Input
          placeholder="Generated Password"
          rightSection={<RightSection value={currentPassword} />}
          value={currentPassword}
          readOnly
        />
      </InputWrapper>
      <Space mt={4} />
      <NumberInput
        label="Number of characters"
        id="length"
        defaultValue={values.length}
        placeholder="Your age"
        style={{ marginLeft: "10px", marginRight: "10px" }}
        onChange={(val) => updateLength(val)}
      />
      <SimpleGrid cols={2} style={{ padding: "10px" }}>
        <Checkbox
          id="numbers"
          checked={values.numbers}
          label="Numbers"
          onChange={(e) =>
            updateValues(e.currentTarget.id, e.currentTarget.checked)
          }
        />
        <Checkbox
          id="symbols"
          checked={values.symbols}
          label="Symbols"
          onChange={(e) =>
            updateValues(e.currentTarget.id, e.currentTarget.checked)
          }
        />
        <Checkbox
          id="uppercase"
          checked={values.uppercase}
          label="Uppercase"
          onChange={(e) =>
            updateValues(e.currentTarget.id, e.currentTarget.checked)
          }
        />
        <Checkbox
          id="lowercase"
          checked={values.lowercase}
          label="Lowercase"
          disabled
        />
      </SimpleGrid>
      <Space mt={4} />
      <Button fullWidth color="indigo" onClick={generateNewPassword}>
        Generate
      </Button>
    </Container>
  );
}

export default PasswordGenerator;
