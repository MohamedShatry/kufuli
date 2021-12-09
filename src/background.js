// @ts-nocheck
const baseUrl = 'https://us-central1-kufuli-b49c1.cloudfunctions.net/api/';

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
  }

  return true;
});
