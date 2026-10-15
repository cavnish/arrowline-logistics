import type { StructureResolver } from "sanity/structure";

import { SINGLETON_NAMES } from "./schemas/singletons";

const SINGLETON_LABELS: Record<string, string> = {
  siteSettings: "Site settings",
  navigation: "Navigation",
  homePage: "Home page",
  aboutPage: "About page",
  servicesPage: "Services page",
  contactPage: "Contact page",
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Arrowline CMS")
    .items([
      ...SINGLETON_NAMES.map((name) =>
        S.listItem()
          .title(SINGLETON_LABELS[name] || name)
          .id(name)
          .child(S.document().schemaType(name).documentId(name)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_NAMES.includes(String(listItem.getId())),
      ),
    ]);
