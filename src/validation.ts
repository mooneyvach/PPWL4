import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .post(
    "/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 }),
      }),
    },
  )
  .listen(3000);

app.get(
  "/products/:id",
  ({ params, query }) => {
    return { id: params.id, sort: query.sort };
  },
  {
    params: t.Object({
      id: t.Number(),
    }),
    query: t.Object({
      sort: t.Union([t.Literal("asc"), t.Literal("desc")]),
    }),
  },
);

app.get(
  "/stats",
  () => {
    return {
      total: 100,
      active: 50,
    };
  },
  {
    response: t.Object({
      total: t.Number(),
      active: t.Number(),
    }),
  },
);

app.get("/admin", () => ({ stats: 99 }), {
  beforeHandle({ headers, set }) {
    if (headers.authorization !== "Bearer 123") {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
      };
    }
  },
});

app.onAfterHandle(({ response }) => {
  return {
    success: true,
    Message: "data tersedia ,",
    data: response,
  };
});

app.get("/product", () => ({ id: 1, name: "Laptop" }));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
