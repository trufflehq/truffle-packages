import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

import { 
  isTargetEventTopicByParts,
  TruffleCollectibleRedeemEventData,
  handleTruffleWebhookEventSupabase
} from "https://tfl.dev/@truffle/events@0.0.1/index.ts"
  
const VIEWER_CREATED_POLL_EVENT_SLUG = 'viewer-create-poll'
const VIEWER_POLL_TIME_LIMIT_SECONDS = 60
const TRUFFLE_API_URL = 'https://1aac-98-142-186-46.ngrok.io/graphql'

function truffleFetch(query: string, variables: Record<string, unknown>) {
  return fetch(TRUFFLE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables
    }),
    headers: new Headers({
      'Authorization': `Bearer ${Deno.env.get("TRUFFLE_API_KEY")}`
    })
    
  })
}

type UserPayload = {
  data: {
    user: {
      id: string
      name: string
      time: Date
      avatarImage: {
        cdn: string
        prefix: string
        ext: string
        data: unknown
        aspectRatio: number
      }
    }
  }
}

async function getUserById(id: string) {
  const query =  `query UserById ($input: UserInput) {
    user(input: $input) {
      id
      name
      time
    }
  }`

  const variables = {
    input: {
      id
    }
  }

  try {

    const response = await truffleFetch(query, variables)
    const data: UserPayload = await response.json()
  
    return data.data.user
  } catch(err) {
    console.error('error during truffle fetch', err.message)
  }
}

type PollUpsertPayload = {
  data: {
    pollUpsert: {
      poll: {
        id: string
        question: string
        options: ViewerCreatePollUserInputOption[]
      }
    }
  }
}

async function createPoll(question: string, options: ViewerCreatePollUserInputOption[]) {
  const query =  `mutation PollUpsert ($input: PollUpsertInput) {
    pollUpsert(input: $input) {
        poll {
            id
            question
            options {
              text
              index
            }
        }
    }
  }`

  const variables = {
    input: {
      question,
      options,
      durationSeconds: VIEWER_POLL_TIME_LIMIT_SECONDS
    }
  }

  try {
    const response = await truffleFetch(query, variables)
    const data: PollUpsertPayload = await response.json()

    return data.data.pollUpsert.poll
  } catch(err) {
    console.error('error during truffle fetch', err.message)
  }
}


type ViewerCreatePollUserInputOption = {
  text: string;
  index: number
}

type ViewerCreatePollUserInput = {
  question: string;
  options: ViewerCreatePollUserInputOption[]
}

// You can define types for the custom payload of your event
// that you can use to add type safety for your event inside of `handleTruffleWebhookEventSupabase`
type ViewCollectibleEventData = TruffleCollectibleRedeemEventData<
  ViewerCreatePollUserInput
>;

const handler = (request: Request) => handleTruffleWebhookEventSupabase<ViewCollectibleEventData>(request, async (eventData, parts) => {
  const rawResult = await request.json()

  if(!eventData) {
    return new Response(
      JSON.stringify(`Pong! ${JSON.stringify(rawResult)}`),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  const body =  {
    eventData,
    parts
  }

  if(parts) {

    if(isTargetEventTopicByParts(parts, VIEWER_CREATED_POLL_EVENT_SLUG)) {
      console.log('processing events:', parts.slug, eventData)

      const question = eventData.data.additionalData.question
      const pollOptions = eventData.data.additionalData.options
      const userId = eventData.data.userId
      console.log('poll question', question)
      console.log('pollOptions', pollOptions)

      if(userId) {
        const truffleUser = await getUserById(userId)
        const authoredQuestion = `${question} (created by ${truffleUser?.name ?? 'Anonymous'})`
        const poll  = await createPoll(authoredQuestion, pollOptions)
        
        console.log('created poll', JSON.stringify(poll))
      }
    }

  
  }

  return new Response(
    JSON.stringify(body),
    { headers: { "Content-Type": "application/json" } },
  )
})

serve(handler)

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
