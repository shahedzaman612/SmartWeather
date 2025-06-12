import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🌤️ SmartWeather</h1>

        <div className="flex items-center gap-4">
          {/* Optional ThemeToggle component, if you’ve implemented it */}
          {/* <ThemeToggle /> */}

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">{children}</main>

      <footer className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} SmartWeather — All rights reserved By Shahed.
      </footer>
    </div>
  );
}
