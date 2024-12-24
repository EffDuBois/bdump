import { postBetaFeedback } from "@/apis/BetaFeedback";
import { Button } from "@/components/ui/button";
import useTranscriber from "@/services/transcriber";
import { Mic } from "lucide-react";
import { useState } from "react";
import { FaCircleStop } from "react-icons/fa6";
import { toast } from "sonner";

interface FeedbackCardProps {
  user: string;
  clearUser: () => void;
}

export default function FeedbackCard({ user, clearUser }: FeedbackCardProps) {
  const [feedback, setFeedback] = useState("");
  const transcriber = useTranscriber(setFeedback);

  const toggleFeedbackRecording = () => {
    if (!transcriber.recording) {
      transcriber.toggleTranscription();
    } else {
      transcriber.toggleTranscription();
      if (feedback !== "") {
        postBetaFeedback(user, feedback).then(() => {
          setFeedback("");
          toast("Thanks for the feedback!");
        });
      }
    }
  };

  return (
    <div className="p-3 flex flex-col gap-2">
      <p>
        Hey {user},{" "}
        <Button
          className="p-0 text-neutral-600"
          variant={"link"}
          onClick={clearUser}
        >
          not me
        </Button>
      </p>
      <Button
        onClick={toggleFeedbackRecording}
        className="w-full"
        variant={!transcriber.recording ? "default" : "destructive"}
      >
        {!transcriber.recording ? (
          <>
            <Mic />
            Feedback
          </>
        ) : (
          <>
            <FaCircleStop />
            {transcriber.time}
          </>
        )}
      </Button>
    </div>
  );
}
