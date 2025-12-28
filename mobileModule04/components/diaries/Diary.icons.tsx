import { Angry, Frown, Laugh, Meh, Smile } from "lucide-react-native";
import React from "react";

export const DiaryIcons = {
  0: <Angry color="red" />,
  1: <Frown color="orange" />,
  2: <Meh color="yellow" />,
  3: <Smile color="green" />,
  4: <Laugh color="blue" />,
};

export const getDiaryIcon = (feeling: number) => {
  if (!DiaryIcons[feeling as keyof typeof DiaryIcons]) {
    return <Meh color="gray" />;
  }

  return DiaryIcons[feeling as keyof typeof DiaryIcons];
};
