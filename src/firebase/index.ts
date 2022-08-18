// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

/**
 * TODO: Add SDKs for Firebase products that you want to use
 * https://firebase.google.com/docs/web/setup#available-libraries
 * Your web app's Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 */
const firebaseConfig = {
  apiKey: "AIzaSyBSzHjM2iz08VvOR0mKBTIVwzrcxLMUaRQ",
  authDomain: "tsrx-4e51d.firebaseapp.com",
  databaseURL:
    "https://tsrx-4e51d-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "tsrx-4e51d",
  storageBucket: "tsrx-4e51d.appspot.com",
  messagingSenderId: "951035095706",
  appId: "1:951035095706:web:1e71525814f16e05f78d23",
  measurementId: "G-DCMQVJLG36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
const db = getDatabase(app);
const name = "sobha-developers";
const databaseRef = ref(db, `customers/${name}`);

set(databaseRef, {
  id: 1,
  name: "Sobha Developers",
  properties: [
    {
      id: 1,
      name: "Dew Flower",
      tours: [
        {
          id: 1,
          scenes: [
            {
              id: 1,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 1,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 2,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 2,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 3,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 3,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
          ],
        },
        {
          id: 2,
          scenes: [
            {
              id: 1,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 1,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 2,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 2,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 3,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 3,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Opal",
      tours: [
        {
          id: 1,
          scenes: [
            {
              id: 1,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 1,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 2,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 2,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 3,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 3,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
          ],
        },
        {
          id: 2,
          scenes: [
            {
              id: 1,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 1,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 2,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 2,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 3,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 3,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
          ],
        },
        {
          id: 3,
          scenes: [
            {
              id: 1,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 1,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 2,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 2,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
            {
              id: 3,
              hotspots: [
                {
                  uuid: "12sasd22324dasdasd223",
                  id: 3,
                  userData: { targetScene: "https://google.com" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default app;
