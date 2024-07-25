import { z } from "zod";

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    primitives: z.array(z.string()),
  }),
);

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({}), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
