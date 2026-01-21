import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { TDiary } from "./diaries.types";

export const toDiary = (doc: QueryDocumentSnapshot<DocumentData>): TDiary => {
  return {
    id: doc.id,
    email: doc.data().email,
    title: doc.data().title,
    content: doc.data().content,
    date: doc.data().date.toDate(),
    feeling: doc.data().feeling,
  };
};
