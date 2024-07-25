export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://example.com/product.schema.json",
      title: "Hera",
      description: "The config for HeraUI",
      type: "object",
      properties: {
        directory: {
          description: "The relative path of where the components are stored",
          type: "string",
        },
        utils: {
          description: "The relative path of the utils file",
          type: "string",
        },
        framework: {
          description: "The name of the framework used in the project",
          type: "string",
          enum: ["astro", "nextjs"],
        },
      },
      required: ["directory", "utils"],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
