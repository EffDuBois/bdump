import { postBetaFeedback } from "@/apis/BetaFeedback";
import { Button } from "@/components/ui/button";
import useTranscriber from "@/services/transcriber";
import { Mic } from "lucide-react";
import { useState } from "react";
import { FaCircleStop } from "react-icons/fa6";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarSeparator } from "../ui/sidebar";

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
          toast("Thanks for your input!");
        });
      }
    }
  };

  return (
    <div className="p-3 flex flex-col gap-2">
      <div>
        Hey {user}!{" "}
        <Button
          className="p-0 text-neutral-600"
          variant={"link"}
          onClick={clearUser}
        >
          not you?
        </Button>
      </div>
      <Dialog onOpenChange={toggleFeedbackRecording}>
        <DialogTrigger asChild>
          <Button
            disabled={
              transcriber.connectionStatus === "connecting" ||
              transcriber.connectionStatus === "disconnected"
            }
            className="w-full"
          >
            <>
              <Mic />
              Feedback
            </>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>Record your feedback</DialogDescription>
          </DialogHeader>
          <SidebarSeparator />
          <div className="flex flex-col space-x-2">
            <p className="h-[30vh] overflow-y-auto">{feedback}</p>
            <DialogClose asChild>
              <Button variant={"destructive"} type="submit" size="sm">
                <>
                  <FaCircleStop />
                  {transcriber.time}
                </>
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
