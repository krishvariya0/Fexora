import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

/* ----------------------- USER SYSTEM ----------------------- */

// Create or Update User
export const createUser = async (user) => {
    const ref = doc(db, "users", user.uid);
    return setDoc(ref, user, { merge: true });
};

// Get user by UID
export const getUserByID = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
};

// Get user by Email
export const getUserByEmail = async (email) => {
    const q = query(
        collection(db, "users"),
        where("email", "==", email),
        limit(1)
    );

    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};


/* ----------------------- BLOG SYSTEM ----------------------- */

// Create blog → saves in user + global blogs collection
export const createUserBlog = async (userId, blogData) => {
    const userBlogsRef = collection(db, `users/${userId}/blogs`);
    const globalRef = collection(db, "blogs");

    blogData.createdAt = Date.now();
    blogData.updatedAt = Date.now();
    blogData.userId = userId;

    // Save in user collection
    const newBlog = await addDoc(userBlogsRef, blogData);

    // Mirror in global blogs
    await setDoc(doc(globalRef, newBlog.id), blogData);

    return newBlog;
};

// Update blog in both locations
export const updateUserBlog = async (userId, blogId, blogData) => {
    blogData.updatedAt = Date.now();

    await updateDoc(doc(db, `users/${userId}/blogs`, blogId), blogData);
    await updateDoc(doc(db, "blogs", blogId), blogData);

    return true;
};

// Delete blog from both collections
export const deleteUserBlog = async (userId, blogId) => {
    await deleteDoc(doc(db, `users/${userId}/blogs`, blogId));
    await deleteDoc(doc(db, "blogs", blogId));
};


/* ----------------------- FETCH BLOGS ----------------------- */

// Live: Get all blogs for one user
export const getUserBlogs = (userId, callback) => {
    const q = query(
        collection(db, `users/${userId}/blogs`),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) =>
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
};

// Get all blogs once (no realtime)
export const getAllBlogs = async () => {
    const snap = await getDocs(collection(db, "blogs"));
    return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
};

// Live: Get all blogs from everyone
export const getAllBlogsRealtime = (callback) => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snap) =>
        callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
};

// Fetch single blog by id (works globally)
export const getBlogById = async (blogId) => {
    const ref = doc(db, "blogs", blogId);
    const snap = await getDoc(ref);

    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
