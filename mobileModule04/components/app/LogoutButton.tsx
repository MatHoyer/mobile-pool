import { getAuth, signOut } from "firebase/auth";
import Button from "../Button";
import Typography from "../Typography";

const LogoutButton = () => {
  return (
    <Button onPress={() => signOut(getAuth())} variant="destructive">
      <Typography variant="buttonText">Logout</Typography>
    </Button>
  );
};

export default LogoutButton;
