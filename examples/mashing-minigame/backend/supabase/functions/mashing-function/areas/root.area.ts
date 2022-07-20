import { Area, Controller, Post } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";

@Controller()
export class RootController {
  @Post("/ping")
  ping() {
    return `Pong`
  }
}

@Area({
  // NOTE: if deploying to supabase, make sure you set the baseRoute to the name of the function
  // so the alosaur router can handle the supabase proxy
  baseRoute: '/mashing-function',
  controllers: [RootController],
})
export class RootArea {}
