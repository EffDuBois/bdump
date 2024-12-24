import { ModeToggle } from "@/components/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import FeedbackBar from "./feedback/FeedbackButton";

export default function TopBar() {
  return (
    <div className="w-full flex justify-between p-2">
      <SidebarTrigger />
      <div className="flex gap-2">
        <FeedbackBar />
        <ModeToggle />
      </div>
    </div>
  );
}
