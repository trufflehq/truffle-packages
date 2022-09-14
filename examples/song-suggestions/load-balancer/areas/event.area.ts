import { Area } from "alosaur/mod.ts";

import { EventController } from '../controllers/event.controller.ts'
@Area({
  baseRoute: "/event",
  controllers: [EventController],
})
export class EventArea {}
