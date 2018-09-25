importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '393591030275'
});

const messaging = firebase.messaging();