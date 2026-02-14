import { db } from "@/firebaseConfig";
import { TDiary } from "@/lib/diaries/diaries.types";
import { toDiary } from "@/lib/diaries/diaries.utils";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";

const DEFAULT_DIARIES_LIMIT = 2;

export type TLastDiariesStore = {
  allDiaries: TDiary[];
  lastDiaries: TDiary[];
  getDiaries: (userEmail: string) => Promise<void>;
  addDiary: (diary: Omit<TDiary, "id">) => Promise<void>;
  removeDiary: (id: TDiary["id"], userEmail: string) => Promise<void>;
};

const getLastDiaries = async (userEmail: string) => {
  const q = query(collection(db, "diaries"), where("email", "==", userEmail), orderBy("date", "desc"));
  const docs = await getDocs(q);
  return docs.docs.map((doc) => toDiary(doc));
};

const useLastDiariesStore = create<TLastDiariesStore>((set) => ({
  allDiaries: [],
  lastDiaries: [],
  getDiaries: async (userEmail: string) => {
    const allDiaries = await getLastDiaries(userEmail);

    set({ allDiaries, lastDiaries: allDiaries.slice(0, DEFAULT_DIARIES_LIMIT) });
  },
  addDiary: async (diary: Omit<TDiary, "id">) => {
    await addDoc(collection(db, "diaries"), diary);

    const allDiaries = await getLastDiaries(diary.email);
    set({ allDiaries, lastDiaries: allDiaries.slice(0, DEFAULT_DIARIES_LIMIT) });
  },
  removeDiary: async (id: TDiary["id"], userEmail: string) => {
    await deleteDoc(doc(db, "diaries", id));

    const allDiaries = await getLastDiaries(userEmail);
    set({ allDiaries, lastDiaries: allDiaries.slice(0, DEFAULT_DIARIES_LIMIT) });
  },
}));

export default useLastDiariesStore;
