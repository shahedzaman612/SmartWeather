import { db } from "./firebase";
import { collection, addDoc, getDocs, query, doc, deleteDoc } from "firebase/firestore";

export type SavedLocation = {
  name: string;
  lat: number;
  lon: number;
};

// Save a location for a specific user
export async function saveLocation(userId: string, location: SavedLocation): Promise<void> {
  const locRef = collection(db, "users", userId, "locations");
  await addDoc(locRef, location);
}

// Get saved locations for a specific user
export async function getSavedLocations(userId: string): Promise<SavedLocation[]> {
  const locRef = collection(db, "users", userId, "locations");
  const q = query(locRef);
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (SavedLocation & { id: string })[];
}

// Delete a saved location by document ID
export async function deleteLocation(userId: string, locationDocId: string): Promise<void> {
  const docRef = doc(db, "users", userId, "locations", locationDocId);
  await deleteDoc(docRef);
}
