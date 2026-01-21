import { styles } from "@/assets/styles";
import React, { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";

export type TDialogProps = {
  visible: boolean;
  onClose: () => void;
};

export const Dialog: React.FC<TDialogProps & PropsWithChildren> = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent>
      <Pressable onPress={onClose} style={styles.modalBackdrop} />
      <View style={styles.modalContainer}>{children}</View>
    </Modal>
  );
};
