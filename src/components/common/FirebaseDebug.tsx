import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  isFirebaseConfigured,
  getFirebaseStats,
  initializeDefaultChats,
} from "@/utils/firebaseUtils";

interface FirebaseDebugProps {
  currentUserId: string;
}

const FirebaseDebug: React.FC<FirebaseDebugProps> = ({ currentUserId }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<{
    totalChats: number;
    totalMessages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        const configured = isFirebaseConfigured();
        setIsConfigured(configured);

        if (configured) {
          // Try to connect to Firestore
          const testCollection = collection(db, "chats");
          await getDocs(testCollection);
          setIsConnected(true);

          // Get stats
          const statsData = await getFirebaseStats();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Firebase connection error:", error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkFirebase();
  }, []);

  const handleInitializeChats = async () => {
    try {
      await initializeDefaultChats(currentUserId);
      // Refresh stats
      const statsData = await getFirebaseStats();
      setStats(statsData);
      alert("✅ Default chats created successfully!");
    } catch (error) {
      console.error("Error initializing chats:", error);
      alert("❌ Error creating chats. Check console for details.");
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Status Indicator */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${
          isConnected
            ? "bg-green-500 hover:bg-green-600"
            : isConfigured
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-red-500 hover:bg-red-600"
        } transition-colors`}
        title={
          isConnected
            ? "Firebase Connected"
            : isConfigured
            ? "Firebase Configured but not connected"
            : "Firebase Not Configured"
        }
      >
        <span className="text-white text-2xl">🔥</span>
      </button>

      {/* Debug Panel */}
      {showDebug && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Firebase Status</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Configuration Status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isConfigured ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {isConfigured ? "Configured" : "Not Configured"}
              </span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {/* Stats */}
            {isConnected && stats && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Chats:</span>
                    <span className="font-semibold">{stats.totalChats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Messages:</span>
                    <span className="font-semibold">{stats.totalMessages}</span>
                  </div>
                </div>

                {/* Initialize Button */}
                {stats.totalChats === 0 && (
                  <button
                    onClick={handleInitializeChats}
                    className="mt-4 w-full bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white py-2 px-4 rounded-lg text-sm hover:opacity-90 transition"
                  >
                    Create Default Chats
                  </button>
                )}
              </div>
            )}

            {/* Not Configured Message */}
            {!isConfigured && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Firebase is not configured yet.
                </p>
                <a
                  href="/FIREBASE_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Setup Guide →
                </a>
              </div>
            )}

            {/* Configured but not connected */}
            {isConfigured && !isConnected && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Check your Firebase configuration and make sure Firestore is
                  enabled.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseDebug;
