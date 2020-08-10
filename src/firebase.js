import React from 'react';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
   
        apiKey: "AIzaSyB8ERHh_62UgUyqmaZ1wILAYGhM6eYEAp4",
        authDomain: "instagram-clone-picswatch.firebaseapp.com",
        databaseURL: "https://instagram-clone-picswatch.firebaseio.com",
        projectId: "instagram-clone-picswatch",
        storageBucket: "instagram-clone-picswatch.appspot.com",
        messagingSenderId: "362955564649",
        appId: "1:362955564649:web:5b9d1e3a7d24192f4aa4f8",
        measurementId: "G-B3XWT99S33"
         
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};
