"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      // Firebase Auth error handling
      if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/user-not-found") {
          throw new Error("No account found with this email address.");
        }
        if (code === "auth/wrong-password") {
          throw new Error("Incorrect password. Please try again.");
        }
        if (code === "auth/invalid-email") {
          throw new Error("Invalid email address.");
        }
        if (code === "auth/too-many-requests") {
          throw new Error("Too many failed attempts. Please try again later.");
        }
      }
      throw new Error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/email-already-in-use") {
          throw new Error("This email is already registered.");
        }
        if (code === "auth/invalid-email") {
          throw new Error("Invalid email address.");
        }
        if (code === "auth/weak-password") {
          throw new Error("Password should be at least 6 characters.");
        }
      }
      throw new Error("Signup failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};
