const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('username is required');
}

const socket = io();
