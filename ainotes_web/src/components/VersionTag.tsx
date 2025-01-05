const VersionTag = ({ version }: { version: string }) => {
  return (
    <p className={`z-10 absolute bottom-0 left-0 text-neutral-400`}>
      {version}
    </p>
  );
};

export default VersionTag;
