import { objectTypes } from "./objects";
import { documentTypes } from "./documents";
import { singletonTypes } from "./singletons";

/** Every schema type registered with the Studio. */
export const schemaTypes = [...objectTypes, ...documentTypes, ...singletonTypes];
