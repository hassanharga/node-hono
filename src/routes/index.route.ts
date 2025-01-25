import { z } from "zod";

import { createAppRouter } from "@/lib/create-app";

const router = createAppRouter().openapi(
  {
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "index api",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  },
  (c) => {
    return c.json({ message: "index page" });
  }
);

export default router;
