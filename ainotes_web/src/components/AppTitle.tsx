import { interfaceFont, titleFont } from "@/ui/fonts";

export default function AppTitle() {
  return (
    <h1 className={`text-4xl m-4 text-center ${titleFont.className} relative`}>
      BrainDump
      <p
        className={`absolute top-0 right-0 text-lg -translate-x-2 -translate-y-2  ${interfaceFont.className}`}
      >
        Beta
      </p>
    </h1>
  );
}
