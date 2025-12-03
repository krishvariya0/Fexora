// Logout function for use in ProfilePage
import {
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";




const provider = new GoogleAuthProvider();

export const signUpWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithGoogle = () => {
    return signInWithPopup(auth, provider);
};

export const forgetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
    await signOut(auth);
};

import { verifyPasswordResetCode } from "firebase/auth";

export const resetPassword = async (oobCode, newPassword) => {
    // STEP 1 → Check if code is valid
    await verifyPasswordResetCode(auth, oobCode);

    // STEP 2 → Update password
    return await confirmPasswordReset(auth, oobCode, newPassword);
};


