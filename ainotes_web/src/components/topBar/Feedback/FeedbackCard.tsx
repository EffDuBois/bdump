import { Button } from "@/components/ui/button";
import useTranscriber from "@/services/transcriber";
import { Mic, Square } from "lucide-react";
import { useState } from "react";
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
        //send data to backend. then clear feedback
        toast("Thanks for the feedback!");
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
            <Square />
            Recording
          </>
        )}
      </Button>
    </div>
  );
}
