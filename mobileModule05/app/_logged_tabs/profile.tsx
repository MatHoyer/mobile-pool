import Button from "@/components/Button";
import { Dialog, TDialogProps } from "@/components/Dialog";
import { Diaries } from "@/components/diaries/Diaries";
import { DiaryIcons, getDiaryIcon } from "@/components/diaries/Diary.icons";
import Input from "@/components/Input";
import { useAuth } from "@/components/providers/auth.provider";
import PrivateRoute from "@/components/routes/PrivateRoute";
import Typography from "@/components/Typography";
import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const FeelingSelector: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => {
  return (
    <View style={{ flexDirection: "column", gap: 10 }}>
      <Typography variant="large">Feeling</Typography>
      <View
        style={{
          flexDirection: "row",
          gap: 0,
          padding: 1,
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        {Object.keys(DiaryIcons)
          .map(Number)
          .map((item) => (
            <Button key={item} variant={value === item ? "outline" : "ghost"} onPress={() => onChange(item)}>
              {getDiaryIcon(item)}
            </Button>
          ))}
      </View>
    </View>
  );
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  feeling: z.number().min(0).max(4),
});

const CreateDiaryDialog: React.FC<TDialogProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { addDiary } = useLastDiariesStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      feeling: 0,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleCreateDiary = async ({ title, content, feeling }: z.infer<typeof formSchema>) => {
    if (!user?.email) return;

    await addDiary({
      email: user.email,
      title,
      content,
      date: new Date(),
      feeling,
    });

    handleClose();
  };

  return (
    <Dialog visible={visible} onClose={handleClose}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Typography variant="large">Create Diary</Typography>
        <Input
          placeholder="Title"
          value={form.watch("title")}
          onChangeText={(text) => form.setValue("title", text)}
          error={form.formState.errors.title?.message}
        />
        <Input
          placeholder="Content"
          value={form.watch("content")}
          onChangeText={(text) => form.setValue("content", text)}
          multiline
          numberOfLines={10}
          error={form.formState.errors.content?.message}
        />
        <FeelingSelector value={form.watch("feeling")} onChange={(value) => form.setValue("feeling", value)} />
        <Button onPress={form.handleSubmit(handleCreateDiary)}>
          <Typography variant="buttonText">Create Diary</Typography>
        </Button>
      </View>
    </Dialog>
  );
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ProfileGestion = () => {
  const { user } = useAuth();
  console.log(user?.photoURL);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Image
        source={user?.photoURL ?? ""}
        style={{ width: 100, height: 100, borderRadius: 50 }}
        contentFit="cover"
        placeholder={{ blurhash }}
      />
      <Typography variant="large">{user?.displayName}</Typography>
    </View>
  );
};

// do a card component
const Stats = () => {
  return (
    <View>
      <Typography variant="large">Stats</Typography>
    </View>
  );
};

const Profile = () => {
  const { user } = useAuth();

  const { lastDiaries, getLastDiaries } = useLastDiariesStore();

  useEffect(() => {
    if (!user?.email) return;

    void getLastDiaries(user.email!);
  }, [user, getLastDiaries]);

  const [isCreateDiaryDialogVisible, setIsCreateDiaryDialogVisible] = useState(false);

  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
        paddingVertical: 20,
      }}
    >
      <PrivateRoute>
        <ProfileGestion />
        <Diaries diaries={lastDiaries} />
        <Stats />
        <Button
          onPress={() => {
            setIsCreateDiaryDialogVisible(true);
          }}
        >
          <Typography variant="buttonText">Create Diary</Typography>
        </Button>
      </PrivateRoute>
      <CreateDiaryDialog visible={isCreateDiaryDialogVisible} onClose={() => setIsCreateDiaryDialogVisible(false)} />
    </SafeAreaView>
  );
};

export default Profile;
