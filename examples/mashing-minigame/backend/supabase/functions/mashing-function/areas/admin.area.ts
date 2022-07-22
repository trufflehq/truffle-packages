import { Area } from "alosaur/mod.ts";

import { AdminController } from "../controllers/admin.controller.ts";

@Area({
  baseRoute: "/mashing-function",
  controllers: [AdminController],
})
export class AdminArea {}
