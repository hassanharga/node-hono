import type { OpenApiApp } from "@/types/types";

import packageJSON from "../../package.json";

export default function configureOpenApi(app: OpenApiApp) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: packageJSON.version,
      description: "My API description",
    },
  });
}
