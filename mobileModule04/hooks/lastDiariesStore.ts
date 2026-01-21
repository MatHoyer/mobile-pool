import { db } from "@/firebaseConfig";
import { TDiary } from "@/lib/diaries/diaries.types";
import { toDiary } from "@/lib/diaries/diaries.utils";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";

export type TLastDiariesStore = {
  lastDiaries: TDiary[];
  getLastDiaries: (userEmail: string) => Promise<void>;
  addDiary: (diary: Omit<TDiary, "id">) => Promise<void>;
  removeDiary: (id: TDiary["id"], userEmail: string) => Promise<void>;
};

const getLastDiaries = async (userEmail: string) => {
  const q = query(collection(db, "diaries"), where("email", "==", userEmail), orderBy("date", "desc"), limit(5));
  const docs = await getDocs(q);
  return docs.docs.map((doc) => toDiary(doc));
};

const useLastDiariesStore = create<TLastDiariesStore>((set) => ({
  lastDiaries: [],
  getLastDiaries: async (userEmail: string) => {
    const lastDiaries = await getLastDiaries(userEmail);
    set({ lastDiaries });
  },
  addDiary: async (diary: Omit<TDiary, "id">) => {
    await addDoc(collection(db, "diaries"), diary);
    const lastDiaries = await getLastDiaries(diary.email);
    set({ lastDiaries });
  },
  removeDiary: async (id: TDiary["id"], userEmail: string) => {
    await deleteDoc(doc(db, "diaries", id));
    const lastDiaries = await getLastDiaries(userEmail);
    set({ lastDiaries });
  },
}));

export default useLastDiariesStore;
