import { Area, Controller, Post } from "alosaur/mod.ts";

@Controller()
export class RootController {
  @Post("/ping")
  ping() {
    return `Pong`;
  }
}

@Area({
  controllers: [RootController],
})
export class RootArea {}
