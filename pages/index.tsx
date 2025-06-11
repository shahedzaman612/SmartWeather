
import { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-center flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">🌤️ SmartWeather</h1>
      <p className="text-lg text-gray-700 max-w-md mb-6">
        Get real-time weather updates for any city in the world.  
        Powered by OpenWeather & OpenStreetMap — no signup required.
      </p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Get Started
      </a>
    </div>
  );
}
