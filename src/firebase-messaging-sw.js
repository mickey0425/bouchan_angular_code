importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': 'AAAAKqA9lPk:APA91bH7YSDULzzB3lwNe5zfJ5RN7QeAwidexcyhqu1iplQSfmO9zpXK4-z0kdGFwLtOxKknwsVKuFumJO4M7Gkwoq3g4uQf56vSjCdflLa-PqNmXQiB-SA5VY0miSZvQNVhMWGrZI-K'
});

const messaging = firebase.messaging();
