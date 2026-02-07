import { Angry, Frown, Laugh, Meh, Smile } from "lucide-react-native";
import React from "react";

export enum Feelings {
  ANGRY = 0,
  FROWN = 1,
  MEH = 2,
  SMILE = 3,
  LAUGH = 4,
}

export const isFeeling = (potentialFeeling: number): potentialFeeling is Feelings => {
  return potentialFeeling >= 0 || potentialFeeling <= 4;
};

export const DiaryIcons = {
  [Feelings.ANGRY]: <Angry color="red" />,
  [Feelings.FROWN]: <Frown color="orange" />,
  [Feelings.MEH]: <Meh color="yellow" />,
  [Feelings.SMILE]: <Smile color="green" />,
  [Feelings.LAUGH]: <Laugh color="blue" />,
};

export const getDiaryIcon = (feeling: number) => {
  if (!isFeeling(feeling)) return DiaryIcons[Feelings.MEH];

  return DiaryIcons[feeling];
};
