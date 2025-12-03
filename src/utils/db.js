import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export const createUser = async (user) => {
    console.log("user", user);
    const ref = doc(db, "users", user?.uid);
    return setDoc(ref, user);
}

export const getUserByEmail = async (email) => {
    const q = query(
        collection(db, "users"),
        where("email", "==", email),
        limit(1) // 🔥 ensures only ONE document is returned
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const doc = snap.docs[0]; // get FIRST result
    return { id: doc.id, ...doc.data() };
};


export const getUserByID = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        return snap.data();
    } else {
        return null; // user not found
    }
};