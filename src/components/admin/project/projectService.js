// src/admin/project/projectService.js
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

// COLLECTION REFERENCE
const projectsCollection = collection(db, "projects");

// FETCH all projects from Firestore
export const getProjects = async () => {
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ADD a new project
export const addProject = async (project) => {
  await addDoc(projectsCollection, project);
};

// UPDATE a project by Firestore ID
export const updateProject = async (project) => {
  const docRef = doc(db, "projects", project.id);
  const { id, ...rest } = project;
  await updateDoc(docRef, rest);
};

// DELETE a project
export const deleteProject = async (id) => {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
};
