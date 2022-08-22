import { TruffleRepository } from "./truffle.repository.ts";
import { YouTubeConnectionQueryResponse } from '../types/mod.ts'
export class ConnectionRepository {
  private truffleRepository: TruffleRepository;

  constructor() {
    this.truffleRepository = new TruffleRepository();
  }

  async getYouTubeConnection(orgId: string, userId: string) {
    const query = `
      query YouTubeConnectionQuery($input: ConnectionInput) {
        connection(input: $input) {
          id
          sourceType
          sourceId
          data
          orgUser {
            name
            user {
              name
            }
          }
        }
      }`;

    const input = {
      input: {
        orgId,
        userId,
        sourceType: 'youtube'
      },
    };

    try {

      const response = await this.truffleRepository.fetch(query, input, orgId);
  
      console.log('truffle get connection response', response)
  
      const data: YouTubeConnectionQueryResponse = await response.json();
  
      console.log('connection res', data.data)

      return data.data.connection;
    }  catch(err) {
      console.error('error fetching connection')
    }
  }
}
