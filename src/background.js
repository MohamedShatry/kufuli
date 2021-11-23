/* global chrome */
import { initializeApp } from 'firebase/app';

let password = '';
let email = '';
let baseUrl = '';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === 'isLoggedIn') {
    sendResponse({
      success: password !== '' && email !== '',
    });
  } else if (msg.command === 'login') {
    sendResponse({
      message: 'success',
    });
  } else if (msg.command === 'signup') {
    sendResponse({
      message: 'success',
    });
  }
  return true;
});
