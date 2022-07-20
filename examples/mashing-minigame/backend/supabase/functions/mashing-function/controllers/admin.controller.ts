import { Controller, Post, Body, BadRequestError } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";
import { validateDTO } from '../utils/validation.ts'
import { MashingConfigModelDTO } from '../models/mod.ts'
import { ConfigService } from '../services/config.service.ts'

@Controller("/admin")
export class AdminController {
  private configService: ConfigService

  constructor() {
    this.configService = new ConfigService()
  }
  // constructor(private configService: ConfigService) {}

  @Post("/start")
  async start(@Body(MashingConfigModelDTO) dto: MashingConfigModelDTO) {
    await validateDTO(dto)
    
    const orgId = dto.data?.orgId
    const config = {
      orgUserCounterTypeId: dto.data?.orgUserCounterTypeId,
      endTime: dto.data?.endTime
    }

    // this.configService.foo()
    if(orgId && config) {
      const upsertedConfig = await this.configService.upsertConfig(orgId, config)


      return {
        data: upsertedConfig
      }
    } else {
      throw new BadRequestError("Missing config options")
    }

  }
}