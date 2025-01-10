
import { recordingStatusType } from "@/lib/transcriber";
import { FaCircle } from "react-icons/fa6";

const ConnectionStatusMap = {
  connecting: (
    <>
      <FaCircle className="inline text-yellow-300" size={"10px"} />{" "}
      Connecting...
    </>
  ),
  connected: (
    <>
      <FaCircle className="inline text-white" size={"10px"} /> Online
    </>
  ),
  transmitting: (
    <>
      <FaCircle className="inline text-green-300" size={"10px"} /> Connected
    </>
  ),
  disconnected: (
    <>
      <FaCircle className="inline text-white" size={"10px"} /> Trying to
      connect...
    </>
  ),
};

const ConnectionIndicator = ({
  connectionStatus,
}: {
  connectionStatus: recordingStatusType;
}) => {
  return (
    <div className="sticky bottom-0 right-0 self-end text-neutral-400">
      {ConnectionStatusMap[connectionStatus] || "Unknown Status"}
    </div>
  );
};

export default ConnectionIndicator;
