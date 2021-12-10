const populateEmail = (email) => {
  const emailElement = document.querySelector(
    'input[id="email"],input[id="login"],input[name="email"],input[name="login"],input[name="signin"],input[class="login"]'
  );
  // @ts-ignore
  emailElement.value = email;
};

const populatePassword = (password) => {
  const passwordElement = document.querySelector('input[type="password"]');
  // @ts-ignore
  passwordElement.value = password;
};

chrome.runtime.sendMessage({ command: 'getActiveCredentials' }, (response) => {
  const pageCredentials = response.credentials;
  if (pageCredentials.length > 0) {
    const firstResponse = pageCredentials[0];
    populateEmail(firstResponse.email);
    populatePassword(firstResponse.password);
  }
});
