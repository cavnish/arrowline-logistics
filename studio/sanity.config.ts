import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemas";
import { SINGLETON_NAMES } from "./schemas/singletons";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId) {
  // Fail loudly rather than silently pointing at the wrong project.
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID. Copy studio/.env.example to studio/.env and set your Sanity project id.",
  );
}

export default defineConfig({
  name: "arrowline-logistics",
  title: "Arrowline Logistics CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Singletons are opened via the desk structure; don't allow creating or
    // deleting extra copies of them.
    actions: (input, context) =>
      SINGLETON_NAMES.includes(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action !== undefined &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
  },
});
