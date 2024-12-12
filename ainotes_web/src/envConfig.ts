const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable =
    process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const config = {
  backend_url: getEnvironmentVariable("NEXT_PUBLIC_BACKEND_BASE_URL"),
  deepgram_api_key: getEnvironmentVariable("DEEPGRAM_API_KEY"),
};
