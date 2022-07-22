import { App } from "alosaur/mod.ts";
import { plainToClass } from "class-transformer";

import { AdminArea } from "./areas/admin.area.ts";
import { GameArea } from "./areas/game.area.ts";
import { RootArea } from "./areas/root.area.ts";

const app = new App({
  areas: [RootArea, AdminArea, GameArea],
  logging: true,
});

app.useTransform({
  type: "body",
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body);
  },
});

app.listen();
