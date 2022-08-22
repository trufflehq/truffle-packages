import { SubmissionEventModelDTO } from '../models/mod.ts'
import { classToPlain } from 'class-transformer'
export class LoadBalancerRepository {
  constructor() {
    this.replicaPrefixes = ["truffle-song-suggestion-1"]
  }
  
  private replicaPrefixes: string[]

  
  async forwardSubmissionEvent(dto: SubmissionEventModelDTO) {
    const url = this.getReplicaUrl()
    const obj = classToPlain(dto)
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    return `Redirected POST`
  }

  getReplicaUrl() {
    const prefix = this.replicaPrefixes[Math.floor(this.replicaPrefixes.length * Math.random())]

    return `https://${prefix}.deno.dev/event/submission`
  }
}
