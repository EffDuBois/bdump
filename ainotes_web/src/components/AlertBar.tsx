import { CgClose } from "react-icons/cg";

interface AlertBarTypes {
  text: string;
  closeAlert: () => void;
}

const AlertBar = ({ text, closeAlert }: AlertBarTypes) => {
  return (
    <div className="flex gap-4 absolute left-[50%] translate-x-[-50%] bottom-[20vh] bg-neutral-900 rounded-md pr-5 pl-3 py-3">
      <button onClick={closeAlert}>
        <CgClose size={"20px"} />
      </button>
      <p>{text}</p>
    </div>
  );
};

export default AlertBar;
