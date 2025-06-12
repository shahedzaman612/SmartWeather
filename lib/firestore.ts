// /lib/firestore.ts
import { db } from "./firebase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";

// Define the SavedLocation type with all required fields
export type SavedLocation = {
  name: string;
  lat: number;
  lon: number;
};

// Save a location for a specific user, typed parameters
export async function saveLocation(userId: string, location: SavedLocation): Promise<void> {
  const locRef = collection(db, "users", userId, "locations");
  await addDoc(locRef, location);
}

// Get saved locations for a specific user with correct return type
export async function getSavedLocations(userId: string): Promise<SavedLocation[]> {
  const locRef = collection(db, "users", userId, "locations");
  const q = query(locRef);
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as SavedLocation);
}
