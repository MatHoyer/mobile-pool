export type TDiary = {
  id: string;
  email: string;
  title: string;
  content: string;
  date: Date;
  feeling: number;
};

export type TCreateDiary = Omit<TDiary, "id">;
