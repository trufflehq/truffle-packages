import { App, CorsBuilder } from "alosaur/mod.ts";
import { plainToClass } from "class-transformer";
import { EventArea } from './areas/event.area.ts'

const app = new App({
  areas: [EventArea],
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
    console.log('body', body)
    return plainToClass(transform, body);
  },
});


app.listen();
