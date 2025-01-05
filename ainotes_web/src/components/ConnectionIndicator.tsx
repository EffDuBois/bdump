import { connectionStatusType } from "@/services/transcriber";

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
      <FaCircle className="inline text-green-300" size={"10px"} /> Connected
    </>
  ),
  transmitting: (
    <>
      <FaCircle className="inline text-green-50" size={"10px"} /> Connected
    </>
  ),
  disconnected: (
    <>
      <FaCircle className="inline text-red-400" size={"10px"} /> No Connection
    </>
  ),
};

const ConnectionIndicator = ({
  connectionStatus,
}: {
  connectionStatus: connectionStatusType;
}) => {
  return (
    <div className="absolute bottom-0 right-0 text-neutral-400">
      {ConnectionStatusMap[connectionStatus] || "Unknown Status"}
    </div>
  );
};

export default ConnectionIndicator;
