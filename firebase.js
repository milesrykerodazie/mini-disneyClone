import firebase from 'firebase';

const firebaseConfig = {
   apiKey: 'AIzaSyAX6SqGW_KsS2ig8U2Nmm497gQuTopQFdU',
   authDomain: 'disney-clone-20509.firebaseapp.com',
   projectId: 'disney-clone-20509',
   storageBucket: 'disney-clone-20509.appspot.com',
   messagingSenderId: '984681978375',
   appId: '1:984681978375:web:df9b282b9a0e6b88dc28a2',
};
const app = !firebase.apps.length
   ? firebase.initializeApp(firebaseConfig)
   : firebase.app();

const db = app.firestore();

export { db };
