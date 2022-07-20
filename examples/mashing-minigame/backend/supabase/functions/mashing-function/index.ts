import { App,HttpContext, HttpError, Content } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";
import { plainToClass } from "https://esm.sh/class-transformer";

import { AdminArea } from "./areas/admin.area.ts"
import { GameArea } from './areas/game.area.ts'
import { RootArea } from "./areas/root.area.ts"

// container.resolve(ConfigService)
// container.resolve(AdminController)
const app = new App({
  areas: [RootArea, AdminArea, GameArea],
  logging: true,
});

app.useTransform({
  type: "body",
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body)
  }
})

// global error handler
app.error((context: HttpContext<any>, error: Error) => {
  console.log('error', (error as HttpError).message)
  context.response.result = Content(
    (error as HttpError).message || "This page unprocessed error",
    (error as HttpError).httpCode || 500,
  );
  context.response.setImmediately();
});

app.listen();
