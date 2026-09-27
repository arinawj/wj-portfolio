import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ1IouZZHOGrC4Y-5CpYQ5O4H33SOLrck",
  authDomain: "wj-portfolio.firebaseapp.com",
  projectId: "wj-portfolio",
  storageBucket: "wj-portfolio.firebasestorage.app",
  messagingSenderId: "750717642832",
  appId: "1:750717642832:web:d9050f4f9c7a4f05a9c955",
};

const ADMIN_EMAILS = new Set([
  "arinawj@gmail.com",
  "rorirorirorari@gmail.com",
]);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const entriesRef = collection(db, "portfolioEntries");
const CHUNK_SIZE = 650000;
const listeners = new Set();
const originalSetItem = Storage.prototype.setItem;
let currentUser = null;
let patched = false;
let authSubscribed = false;

function isAdminUser(user) {
  return ADMIN_EMAILS.has(user?.email?.trim().toLowerCase());
}

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

function isPortfolioKey(key) {
  return String(key).startsWith("wj-");
}

async function saveEntry(key, value) {
  if (!isAdminUser(currentUser) || !isPortfolioKey(key)) return;
  const entryId = encodeURIComponent(key);
  const entryRef = doc(entriesRef, entryId);
  const chunksRef = collection(entryRef, "chunks");
  const previousChunks = await getDocs(chunksRef);
  await Promise.all(previousChunks.docs.map((chunk) => deleteDoc(chunk.ref)));
  const chunks = String(value).match(new RegExp(`.{1,${CHUNK_SIZE}}`, "gs")) || [""];
  await Promise.all(chunks.map((chunk, index) => setDoc(doc(chunksRef, String(index).padStart(4, "0")), { value: chunk })));
  await setDoc(entryRef, { key, chunkCount: chunks.length, updatedAt: new Date().toISOString() });
}

export async function initializeCloudStorage() {
  await setPersistence(auth, browserLocalPersistence);

  if (!authSubscribed) {
    onAuthStateChanged(auth, (user) => {
      currentUser = isAdminUser(user) ? user : null;
      notify();
    });
    authSubscribed = true;
  }

  await getRedirectResult(auth).catch((error) => {
    console.warn("Firebase redirect login skipped:", error);
  });

  try {
    const entries = await getDocs(entriesRef);
    await Promise.all(entries.docs.map(async (entry) => {
      const chunks = await getDocs(collection(entry.ref, "chunks"));
      const value = chunks.docs.sort((a, b) => a.id.localeCompare(b.id)).map((chunk) => chunk.data().value).join("");
      if (entry.data().key && value) originalSetItem.call(window.localStorage, entry.data().key, value);
    }));
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

}

export function subscribeToCloudUser(listener) {
  listeners.add(listener);
  listener(currentUser);
  return () => listeners.delete(listener);
}

export async function signInAsEditor() {
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    if (!isAdminUser(result.user)) {
      await signOut(auth);
      throw new Error("등록된 관리자 계정으로 로그인해 주세요.");
    }
  } catch (error) {
    if (error?.code === "auth/popup-blocked" || error?.code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return;
    }
    throw error;
  }
}

export function signOutEditor() {
  return signOut(auth);
}

export async function uploadCurrentLocalContent() {
  if (!isAdminUser(currentUser)) throw new Error("관리자 로그인이 필요합니다.");
  const entries = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (isPortfolioKey(key)) entries.push([key, window.localStorage.getItem(key)]);
  }
  for (const [key, value] of entries) await saveEntry(key, value);
}
