import { Area } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";

import { AdminController } from '../controllers/admin.controller.ts'

@Area({
  baseRoute: "/mashing-function",
  controllers: [AdminController],
})
export class AdminArea {}
