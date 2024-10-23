import { FaCircle } from "react-icons/fa6";

export const ConnectionStatusMap = {
  disconnected: (
    <>
      <FaCircle className="inline text-red-400" size={"10px"} /> No Connection
    </>
  ),
  connected: (
    <>
      <FaCircle className="inline text-green-300" size={"10px"} /> Connected
    </>
  ),
  transmitting: (
    <>
      <FaCircle className="inline text-green-300" size={"10px"} /> Connected
    </>
  ),
  noResponse: (
    <>
      <FaCircle className="inline text-yellow-300" size={"10px"} /> Connecting
    </>
  ),
};
