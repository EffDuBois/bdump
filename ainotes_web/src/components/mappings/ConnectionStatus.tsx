import { FaCircle } from "react-icons/fa6";

export const ConnectionStatusMap = {
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
      <FaCircle className="inline text-green-200" size={"10px"} /> Connected
    </>
  ),
  disconnected: (
    <>
      <FaCircle className="inline text-red-400" size={"10px"} /> No Connection
    </>
  ),
};
