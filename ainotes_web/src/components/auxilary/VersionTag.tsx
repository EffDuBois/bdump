const VersionTag = ({ version }: { version: string }) => {
  return (
    <span className={`z-10 sticky bottom-0 left-0 text-neutral-400`}>
      {version}
    </span>
  );
};

export default VersionTag;
