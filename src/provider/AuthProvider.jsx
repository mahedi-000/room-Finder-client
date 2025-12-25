import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { AuthContext } from "./authContext";
import { auth } from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    const reqId = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {

          console.warn("Unauthorized (401). Check token or session.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = async (name) => {
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    setUser(auth.currentUser);
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    console.log("CurrentUser-->", currentUser?.email);

    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        console.log("Syncing user with backend...");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/sync-firebase-user`,
          {
            idToken: token,
          }
        );

        const userData = response.data.data.user;
        console.log("User synced with DB:", userData);

        localStorage.setItem("accessToken", token);

        setUser(currentUser);
      } catch (error) {
        console.error("Error syncing user:", error);
        console.error("Error details:", error.response?.data || error.message);
        setUser(currentUser);
      }
    } else {
      setUser(null);
      localStorage.removeItem("accessToken");
    }

    setLoading(false);
  });

  return () => {
    return unsubscribe();
  };
}, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
