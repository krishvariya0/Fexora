import {
    addDoc, collection, deleteDoc, doc, getDoc, getDocs,
    onSnapshot, orderBy, query, setDoc, updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

// Save user to Firestore
export const createUser = async (user) => {
    const ref = doc(db, "users", user.uid);
    return setDoc(ref, user, { merge: true });
};

export const getUserByID = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
};

// Create blog under user
export const createUserBlog = async (userId, blogData) => {
    const ref = collection(db, `users/${userId}/blogs`);
    blogData.createdAt = Date.now();
    blogData.updatedAt = Date.now();
    return addDoc(ref, blogData);
};

// Update blog
export const updateUserBlog = async (userId, blogId, blogData) => {
    const ref = doc(db, `users/${userId}/blogs`, blogId);
    blogData.updatedAt = Date.now();
    return updateDoc(ref, blogData);
};

// Delete blog
export const deleteUserBlog = async (userId, blogId) => {
    const ref = doc(db, `users/${userId}/blogs`, blogId);
    return deleteDoc(ref);
};

// Get user blogs live sync
export const getUserBlogs = (userId, callback) => {
    const ref = collection(db, `users/${userId}/blogs`);
    const q = query(ref, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

// Get all blogs from all users
export const getAllBlogs = async () => {
    const users = await getDocs(collection(db, "users"));
    const result = [];

    for (const user of users.docs) {
        const ref = await getDocs(collection(db, `users/${user.id}/blogs`));

        ref.forEach((blog) => {
            result.push({ id: blog.id, userId: user.id, ...blog.data() });
        });
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
};

// Fetch single blog by ID from any user
export const getBlogById = async (blogId) => {
    const users = await getDocs(collection(db, "users"));

    for (const user of users.docs) {
        const ref = doc(db, `users/${user.id}/blogs`, blogId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            return { id: blogId, userId: user.id, ...snap.data() };
        }
    }

    return null;
};

export const getUserByEmail = async (email) => {
    const q = query(
        collection(db, "users"),
        where("email", "==", email),
        limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
};
