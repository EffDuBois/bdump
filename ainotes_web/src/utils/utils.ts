export const getTitleFromPath = (path: string | undefined) => {
  return path?.replace(/^.*[\\/]/, "");
};

interface ConditionFunction {
  (): boolean;
}

export function until(conditionFunction: ConditionFunction): Promise<void> {
  console.log("Deferring");

  const poll = (resolve: () => void) => {
    if (conditionFunction()) resolve();
    else setTimeout(() => poll(resolve), 400);
  };

  return new Promise<void>(poll);
}
