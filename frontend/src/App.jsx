import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

import Register from "./pages/Register";
import Login from "./pages/Login";
import GigList from "./pages/GigList";
import CreateGig from "./pages/CreateGig";
import GigDetail from "./pages/GigDetail";
import Navbar from "./components/Navbar";

import { useAuth } from "./context/AuthContext";

// ✅ Create socket OUTSIDE component (singleton)
const socket = io("http://localhost:5001", {
  withCredentials: true,
  autoConnect: false, // Wait until logged in
});

function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Pass userId in handshake
      socket.io.opts.query = { userId: user._id };
      socket.connect();

      // Listen for hire notification
      socket.on("hired-notification", (data) => {
        alert(`🎉 ${data.message}\nProject: ${data.gigTitle}`);
      });
    }

    // Cleanup listener
    return () => {
      socket.off("hired-notification");
      socket.disconnect();
    };
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/create" element={<CreateGig />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
