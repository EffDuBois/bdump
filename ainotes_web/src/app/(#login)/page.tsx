"use client";

import { signInWithGoogle, signOutWithGoogle } from "@/services/firebase/auth";
import { createSession, removeSession } from "@/actions/authActions";
import CircleButton from "@/components/buttons/CircleButton";
import { BsGoogle } from "react-icons/bs";
import { titleFont } from "@/ui/fonts";

export default function Login() {
  const handleSignIn = async () => {
    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1
        className={`text-4xl mb-8 text-center ${titleFont.className} justify-self-start`}
      >
        BrainDump
      </h1>
      <CircleButton onClick={handleSignIn}>
        <BsGoogle size={"38px"} />
      </CircleButton>
    </div>
  );
}