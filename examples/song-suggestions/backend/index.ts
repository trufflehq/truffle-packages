import { App, CorsBuilder } from "alosaur/mod.ts";
import { plainToClass } from "class-transformer";
import { AdminArea } from './areas/admin.area.ts'
import { EventArea } from './areas/event.area.ts'

const app = new App({
  areas: [AdminArea, EventArea],
  logging: true,
});

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
)

app.useTransform({
  type: "body",
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body);
  },
});


app.listen();
