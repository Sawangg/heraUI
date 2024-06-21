import { error } from "@utils/message";
import { z } from "zod";

const baseUrl = "https://raw.githubusercontent.com/shadcn-ui/ui";

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    primitives: z.array(z.string()),
  }),
);

export const getRegistry = async () => {
  const res = await fetch(`${baseUrl}/main/package.json`);
  if (!res.ok) {
    error("Could not get the registry. Exiting.");
    process.exit(1);
  }
  const data = await res.json();
  return registrySchema.parse(data);
};
