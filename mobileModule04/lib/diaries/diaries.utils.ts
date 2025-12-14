import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { TCreateDiary, TDiary } from "./diaries.types";

const toDiary = (doc: QueryDocumentSnapshot<DocumentData>): TDiary => {
  return {
    id: doc.id,
    email: doc.data().email,
    title: doc.data().title,
    content: doc.data().content,
    date: doc.data().date.toDate(),
    feeling: doc.data().feeling,
  };
};

export const getUserLastDiaries = async (userEmail: TDiary["email"]) => {
  const q = query(collection(db, "diaries"), where("email", "==", userEmail), orderBy("date", "desc"), limit(5));
  const docs = await getDocs(q);
  return docs.docs.map((doc) => toDiary(doc));
};

export const createDiary = async (diary: TCreateDiary) => {
  const doc = await addDoc(collection(db, "diaries"), diary);
  return doc;
};

export const deleteDiary = async (diaryId: TDiary["id"]) => {
  await deleteDoc(doc(db, "diaries", diaryId));
};
