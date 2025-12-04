import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
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

// Blog functions for user-specific data storage
export const createUserBlog = async (userId, blogData) => {
    const blogRef = collection(db, `blogbyuser${userId}`);
    const newBlog = {
        ...blogData,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    return addDoc(blogRef, newBlog);
};

export const updateUserBlog = async (userId, blogId, blogData) => {
    const blogRef = doc(db, `blogbyuser${userId}`, blogId);
    const updateData = {
        ...blogData,
        updatedAt: Date.now()
    };
    return updateDoc(blogRef, updateData);
};

export const deleteUserBlog = async (userId, blogId) => {
    const blogRef = doc(db, `blogbyuser${userId}`, blogId);
    return deleteDoc(blogRef);
};

export const getUserBlogs = (userId, callback) => {
    const blogsRef = collection(db, `blogbyuser${userId}`);
    const q = query(blogsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
        const blogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(blogs);
    }, (error) => {
        console.error("Error fetching user blogs:", error);
        callback([]);
    });
};
