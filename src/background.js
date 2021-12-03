// @ts-nocheck
const baseUrl = 'https://us-central1-kufuli-b49c1.cloudfunctions.net/api/';

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.command === 'isLoggedIn') {
    const val = localStorage.getItem('loggedIn');
    sendResponse({
      success: val,
    });
  } else if (msg.command === 'login') {
    const response = await fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: msg.data.email,
        password: msg.data.password,
      }),
    }).catch((err) => {
      sendResponse({
        message: 'error',
      });
    });

    localStorage.setItem('loggedIn', true);
    sendResponse({
      message: 'success',
    });
  } else if (msg.command === 'signup') {
    const response = await fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: msg.data.email,
        password: msg.data.password,
        confirmPassword: msg.data.confirmPassword,
      }),
    }).catch((err) => {
      sendResponse({
        message: 'error',
      });
    });

    localStorage.setItem('loggedIn', true);
    sendResponse({
      message: 'success',
    });
  }
  return true;
});
