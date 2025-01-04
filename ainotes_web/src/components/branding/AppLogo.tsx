import { interfaceFont, titleFont } from "@/ui/fonts";
import LogoImage from "./LogoImge";

export default function AppTitle() {
  return (
    <a className="flex justify-center items-end m-4 gap-2" href="/">
      <LogoImage height={"3rem"} />
      <h1 className={`text-4xl text-center ${titleFont.className} relative`}>
        BrainDump
        <p
          className={`absolute top-0 right-0 text-lg -translate-x-[2rem] translate-y-[1.77rem]  ${interfaceFont.className}`}
        >
          Beta
        </p>
      </h1>
    </a>
  );
}
