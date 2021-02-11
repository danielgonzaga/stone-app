import firebase from 'firebase/app'
import 'firebase/firestore'

export function firebaseDB() {
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyDyb_1cpkyThKwigtUmYGI5v8HzaKASy2Y",
      authDomain: "stone-app-db.firebaseapp.com",
      databaseURL: "https://stone-app-db-default-rtdb.firebaseio.com",
      projectId: "stone-app-db",
      storageBucket: "stone-app-db.appspot.com",
      messagingSenderId: "742088197064",
      appId: "1:742088197064:web:b9fecd989b6aaeb79ef6fd",
      measurementId: "G-HPXB35WQ60"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.firestore().settings({timestampsInSnapshot: true})
    } else {
      firebase.app();
    }
  } catch (error) {
    alert(error.message)
  }
  return firebase
}