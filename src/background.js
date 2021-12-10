// @ts-nocheck
const baseUrl = 'https://us-central1-kufuli-b49c1.cloudfunctions.net/api/';

chrome.runtime.onStartup.addListener(async () => {
  let cookiePresent = false;
  await chrome.cookies.get({ url: baseUrl, name: 'key' }, (cookie) => {
    if (cookie.value) {
      cookiePresent = true;
    }
  });

  if (cookiePresent) {
    fetch(baseUrl + 'getCredentials').then(async (res) => {
      const received = await res.json();
      if (res.ok) {
        localStorage.setItem('credentials', JSON.stringify(received.data));
      }
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'isLoggedIn') {
    const val = localStorage.getItem('loggedIn');
    if (val) {
      sendResponse({
        user: true,
      });
    } else {
      sendResponse({
        user: false,
      });
    }
  } else if (msg.command === 'login') {
    fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: msg.data.email,
        password: msg.data.password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          sendResponse({
            error: true,
            message: '',
            errorMessage: data.message,
          });
        } else {
          localStorage.setItem('loggedIn', true);

          sendResponse({
            error: false,
            message: data.message,
            errorMessage: '',
          });
        }
      })
      .catch((err) => {
        sendResponse({
          error: true,
          errorMessage: err,
          message: '',
        });
      });
  } else if (msg.command === 'signup') {
    fetch(baseUrl + 'signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: msg.data.email,
        password: msg.data.password,
        confirmPassword: msg.data.confirmPassword,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          sendResponse({
            error: true,
            message: '',
            errorMessage: data.message,
          });
        } else {
          localStorage.setItem('loggedIn', true);
          sendResponse({
            error: false,
            message: data.message,
            errorMessage: '',
          });
        }
      })
      .catch((err) => {
        sendResponse({
          error: true,
          errorMessage: err,
          message: '',
        });
      });
  } else if (msg.command === 'getCredentials') {
    fetch(baseUrl + 'getCredentials').then(async (res) => {
      const received = await res.json();
      if (!res.ok) {
        sendResponse({
          error: true,
          message: '',
          errorMessage: 'Error received',
        });
      } else {
        localStorage.setItem('credentials', JSON.stringify(received.data));
        sendResponse({
          error: false,
          message: received.data,
          errorMessage: '',
        });
      }
    });
  } else if (msg.command === 'getActiveCredentials') {
    if (sender.tab.url) {
      const url = sender.tab.url;
      const credentials = JSON.parse(localStorage.getItem('credentials'));
      const filteredCredentials = credentials.filter((cred) =>
        url.toLowerCase().includes(cred.domain.toLowerCase())
      );

      sendResponse({
        credentials: filteredCredentials,
        error: false,
      });
    }
    sendResponse({
      error: true,
      errorMessage: 'Could not complete',
    });
  } else if (msg.command === 'registerCredential') {
    fetch(baseUrl + 'registerCredential', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: msg.data.email,
        password: msg.data.password,
        domain: msg.data.domain,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          sendResponse({
            error: true,
            message: '',
            errorMessage: data.message,
          });
        } else {
          const currentStore = JSON.parse(localStorage.getItem('credentials'));
          currentStore.push(data.data);
          localStorage.setItem('credentials', JSON.stringify(currentStore));

          sendResponse({
            error: false,
            message: data.message,
            errorMessage: '',
          });
        }
      })
      .catch((err) => {
        sendResponse({
          error: true,
          errorMessage: err,
          message: '',
        });
      });
  }

  return true;
});
