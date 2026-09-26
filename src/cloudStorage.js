import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ1IouZZHOGrC4Y-5CpYQ5O4H33SOLrck",
  authDomain: "wj-portfolio.firebaseapp.com",
  projectId: "wj-portfolio",
  storageBucket: "wj-portfolio.firebasestorage.app",
  messagingSenderId: "750717642832",
  appId: "1:750717642832:web:d9050f4f9c7a4f05a9c955",
};

const ADMIN_EMAIL = "arinawj@gmail.com";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const contentRef = doc(db, "portfolio", "content");
const listeners = new Set();
const originalSetItem = Storage.prototype.setItem;
let currentUser = null;
let patched = false;

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

function isPortfolioKey(key) {
  return String(key).startsWith("wj-");
}

async function saveEntry(key, value) {
  if (currentUser?.email !== ADMIN_EMAIL || !isPortfolioKey(key)) return;
  await setDoc(contentRef, { entries: { [key]: value }, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function initializeCloudStorage() {
  try {
    const snapshot = await getDoc(contentRef);
    const entries = snapshot.data()?.entries || {};
    Object.entries(entries).forEach(([key, value]) => originalSetItem.call(window.localStorage, key, value));
  } catch (error) {
    console.warn("Firebase content load skipped:", error);
  }

  if (!patched) {
    Storage.prototype.setItem = function setCloudBackedItem(key, value) {
      originalSetItem.call(this, key, value);
      if (this === window.localStorage) saveEntry(key, value).catch(console.warn);
    };
    patched = true;
  }

  onAuthStateChanged(auth, (user) => {
    currentUser = user?.email === ADMIN_EMAIL ? user : null;
    notify();
  });
}

export function subscribeToCloudUser(listener) {
  listeners.add(listener);
  listener(currentUser);
  return () => listeners.delete(listener);
}

export async function signInAsEditor() {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  if (result.user.email !== ADMIN_EMAIL) {
    await signOut(auth);
    throw new Error("등록된 관리자 계정으로 로그인해 주세요.");
  }
  return result.user;
}

export function signOutEditor() {
  return signOut(auth);
}

export async function uploadCurrentLocalContent() {
  if (currentUser?.email !== ADMIN_EMAIL) throw new Error("관리자 로그인이 필요합니다.");
  const entries = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (isPortfolioKey(key)) entries[key] = window.localStorage.getItem(key);
  }
  await setDoc(contentRef, { entries, updatedAt: new Date().toISOString() }, { merge: true });
}

