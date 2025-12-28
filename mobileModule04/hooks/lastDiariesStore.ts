import { db } from "@/firebaseConfig";
import { TDiary } from "@/lib/diaries/diaries.types";
import { toDiary } from "@/lib/diaries/diaries.utils";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";

export type TLastDiariesStore = {
  lastDiaries: TDiary[];
  getLastDiaries: (userEmail: string) => Promise<void>;
  addDiary: (diary: Omit<TDiary, "id">) => Promise<void>;
  removeDiary: (id: TDiary["id"]) => Promise<void>;
};

const useLastDiariesStore = create<TLastDiariesStore>((set) => ({
  lastDiaries: [],
  getLastDiaries: async (userEmail: string) => {
    const q = query(collection(db, "diaries"), where("email", "==", userEmail), orderBy("date", "desc"), limit(5));
    const docs = await getDocs(q);
    set({ lastDiaries: docs.docs.map((doc) => toDiary(doc)) });
  },
  addDiary: async (diary: Omit<TDiary, "id">) => {
    const docRef = await addDoc(collection(db, "diaries"), diary);
    const newDiary = {
      id: docRef.id,
      ...diary,
    };

    set((state) => ({
      lastDiaries: [...state.lastDiaries, newDiary].sort((a, b) => b.date.getTime() - a.date.getTime()),
    }));
  },
  removeDiary: async (id: TDiary["id"]) => {
    await deleteDoc(doc(db, "diaries", id));
    set((state) => ({ lastDiaries: state.lastDiaries.filter((diary) => diary.id !== id) }));
  },
}));

export default useLastDiariesStore;
