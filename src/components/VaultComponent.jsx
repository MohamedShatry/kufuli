import React, { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  Loader,
  Space,
  InputWrapper,
  Input,
  PasswordInput,
  Text,
  Box,
  ActionIcon,
} from "@mantine/core";
import {
  ClipboardIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@modulz/radix-icons";
import { useClipboard, useDebouncedValue } from "@mantine/hooks";

const RightSection = (props) => {
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <>
      <ActionIcon onClick={props.updateHidden}>
        {!props.isHidden && <EyeOpenIcon color="black" />}
        {props.isHidden && <EyeNoneIcon color="black" />}
      </ActionIcon>
      <ActionIcon onClick={() => clipboard.copy(props.value)}>
        <ClipboardIcon color="black" />
      </ActionIcon>
    </>
  );
};

function VaultComponent() {
  const [creds, setCreds] = useState([]);
  const [hidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredValue, setFilteredValue] = useState([]);
  const [debounced] = useDebouncedValue(searchValue, 300);

  const updateHidden = () => {
    setIsHidden(!hidden);
  };

  useEffect(() => {
    setLoading(true);
    chrome.runtime.sendMessage(
      {
        command: "getCredentials",
      },
      (resp) => {
        setCreds(resp.message);
        setLoading(false);
      }
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounced === "") {
      setFilteredValue(creds);
    } else {
      setFilteredValue(
        creds.filter((obj) =>
          obj.domain.toLowerCase().includes(debounced.toLowerCase())
        )
      );
    }
  }, [debounced, creds]);

  return (
    <>
      <Space mt={4} />
      <InputWrapper description="Search for credentials">
        <Input
          placeholder="Domain"
          onChange={(event) => setSearchValue(event.currentTarget.value)}
        />
      </InputWrapper>
      <Space mt={4} />
      {loading && <Loader />}
      <Accordion>
        {filteredValue.map((cred, index) => {
          return (
            <Accordion.Item label={cred.domain}>
              <Box>
                <Text align="left" color="gray" size="sm">
                  {cred.email}
                </Text>
                <Space mt={2} />
                <Input
                  value={cred.password}
                  type={hidden ? "password" : "text"}
                  rightSection={
                    <RightSection
                      isHidden={hidden}
                      updateHidden={updateHidden}
                      value={cred.password}
                    />
                  }
                  styles={{
                    rightSection: { right: "5%" },
                  }}
                />
              </Box>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}

export default VaultComponent;
