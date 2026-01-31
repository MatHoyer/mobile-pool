import { db } from "@/firebaseConfig";
import { TDiary } from "@/lib/diaries/diaries.types";
import { toDiary } from "@/lib/diaries/diaries.utils";
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";

const DEFAULT_DIARIES_LIMIT = 2;

export type TLastDiariesStore = {
  allDiaries: TDiary[];
  lastDiaries: TDiary[];
  getAllDiaries: (userEmail: string) => Promise<void>;
  getLastDiaries: (userEmail: string) => Promise<void>;
  addDiary: (diary: Omit<TDiary, "id">) => Promise<void>;
  removeDiary: (id: TDiary["id"], userEmail: string) => Promise<void>;
};

const getLastDiaries = async (userEmail: string, max: number = DEFAULT_DIARIES_LIMIT) => {
  const q = query(collection(db, "diaries"), where("email", "==", userEmail), orderBy("date", "desc"), limit(max));
  const docs = await getDocs(q);
  return docs.docs.map((doc) => toDiary(doc));
};

const useLastDiariesStore = create<TLastDiariesStore>((set) => ({
  allDiaries: [],
  lastDiaries: [],
  getAllDiaries: async (userEmail: string) => {
    const allDiaries = await getLastDiaries(userEmail);

    set({ allDiaries });
  },
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
