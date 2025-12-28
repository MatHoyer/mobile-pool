import { styles } from "@/assets/styles";
import { TModalProps } from "@/lib/modal.utils";
import React, { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";

export const Dialog: React.FC<TModalProps & PropsWithChildren> = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent>
      <Pressable onPress={onClose} style={styles.modalBackdrop} />
      <View style={styles.modalContainer}>{children}</View>
    </Modal>
  );
};
