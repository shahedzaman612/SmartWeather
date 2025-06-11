import { db } from "./firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";

export async function saveLocation(userId, location) {
  const locRef = collection(db, "users", userId, "locations");
  await addDoc(locRef, location);
}

export async function getSavedLocations(userId) {
  const locRef = collection(db, "users", userId, "locations");
  const q = query(locRef);
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}
