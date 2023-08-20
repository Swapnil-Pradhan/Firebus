const firebaseConfig = {
    apiKey: "AIzaSyABWAJjP1dnbiZioTtjvIoh2bdLklxDTr0",
    authDomain: "fire-bus-151ba.firebaseapp.com",
    databaseURL: "https://fire-bus-151ba-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fire-bus-151ba",
    storageBucket: "fire-bus-151ba.appspot.com",
    messagingSenderId: "808348663603",
    appId: "1:808348663603:web:3f70e621f82133dabcc846",
    measurementId: "G-1QBN6RWMVD"
};

firebase.initializeApp(firebaseConfig);

const stor = firebase.storage(),
    sref = stor.ref(),
    auth = firebase.auth(),
    db = firebase.firestore(),
    rldb = firebase.database();