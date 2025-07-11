import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export type SavedLocation = {
  id?: string;
  name: string;
  lat: number;
  lon: number;
  alertsEnabled?: boolean; // ✅ new field
};

// Save a location for a specific user
export async function saveLocation(
  userId: string,
  location: SavedLocation
): Promise<void> {
  const locRef = collection(db, "users", userId, "locations");
  await addDoc(locRef, {
    name: location.name,
    lat: location.lat,
    lon: location.lon,
    alertsEnabled: location.alertsEnabled ?? true, // ✅ default true
  });
}

// Get saved locations for a specific user
export async function getSavedLocations(
  userId: string
): Promise<SavedLocation[]> {
  const locRef = collection(db, "users", userId, "locations");
  const q = query(locRef);
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as SavedLocation[];
}

// Delete a saved location by document ID
export async function deleteLocation(
  userId: string,
  locationDocId: string
): Promise<void> {
  const docRef = doc(db, "users", userId, "locations", locationDocId);
  await deleteDoc(docRef);
}

// Update alertsEnabled value for a saved location
export async function updateAlertsEnabled(
  userId: string,
  locationDocId: string,
  enabled: boolean
): Promise<void> {
  const docRef = doc(db, "users", userId, "locations", locationDocId);
  await updateDoc(docRef, {
    alertsEnabled: enabled,
  });
}
