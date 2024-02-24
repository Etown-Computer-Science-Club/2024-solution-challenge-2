// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyC_GTYcQwFW8gpHW_1QqNYPH_jkdddbUFk',
	authDomain: 'food-waste-3eb8c.firebaseapp.com',
	projectId: 'food-waste-3eb8c',
	storageBucket: 'food-waste-3eb8c.appspot.com',
	messagingSenderId: '128134861916',
	appId: '1:128134861916:web:eec8bc528f7d5ee1ebc299',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
