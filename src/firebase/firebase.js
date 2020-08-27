import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDZXGQAgeigSb6rKxigSlBy06QzfzJ4HKc",
    authDomain: "my-project-1553607050119.firebaseapp.com",
    databaseURL: "https://my-project-1553607050119.firebaseio.com",
    projectId: "my-project-1553607050119",
    storageBucket: "my-project-1553607050119.appspot.com",
    messagingSenderId: "401980916666",
    appId: "1:401980916666:web:965fe20f0ae53457841383",
    measurementId: "G-K1YXVZXF5X"
};

const firebaseCon = firebase.initializeApp(firebaseConfig);


export const db = firebaseCon.database();