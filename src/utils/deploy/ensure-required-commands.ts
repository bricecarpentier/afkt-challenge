import ensureBinaries from "../ensure-binaries";

const title = "Ensure required commands are available";
const task = async () => {
  const missing = await ensureBinaries("aws", "terraform", "kubectl");
  if (missing.length) {
    const message =
      missing.length === 1
        ? `${missing[0]} is not available`
        : `${missing.join(", ")} are not available`;
    throw new Error(message);
  }
};

export { title, task };
