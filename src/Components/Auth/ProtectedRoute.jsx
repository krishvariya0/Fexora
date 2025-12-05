import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
