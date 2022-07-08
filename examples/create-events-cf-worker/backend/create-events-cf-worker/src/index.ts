import { Router } from "itty-router";
import { getPathParts } from './utils/paths'
import { getPollQuestionWithAuthorName } from "./utils/polls";
import { getUserById } from "./api/user";
import { createPoll } from "./api/polls";

const TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE = "webhook/verification";

declare global {
	const TRUFFLE_API_KEY: string;
	const VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG: string;
}

const router = Router()

router.get('/', () => new Response('OK'))

router.post('/', async (request) => {
	try {

		const req = await request.json!()

		console.log('req', req)

		const data = req?.data
		if(data) {

			const { eventTopicPath } = data
	
			if(eventTopicPath === TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE) {
				console.log('received webhook verification challenge')

				// return the challenge to verify the webhook
				return new Response(data?.challenge, { status: 200 })
			}
			
			// parse the event topic path to get the eventTopicSlug
			const pathParts = getPathParts(eventTopicPath)
			const eventTopicSlug = pathParts?.slug
			
			if(eventTopicSlug === VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG) {
				console.log('poll event')

				const question = data.data.additionalData.question;
				const pollOptions = data.data.additionalData.options;
				const userId = data.data?.userId;
				const orgId = data.data?.orgId;

				const truffleUser = await getUserById(userId)

				console.log('truffleUser', truffleUser)

				const authoredQuestion = getPollQuestionWithAuthorName(question, truffleUser?.name)

				const poll = await createPoll(authoredQuestion, pollOptions, orgId);

				console.log("poll created", JSON.stringify(poll));
	
				return new Response(`OK ${JSON.stringify(data)}`, { status: 200 })
			}
		}

		return new Response("OK")
	} catch (err) {
		console.error(err)
		return new Response(`Error parsing POST ${err}`, { status: 400 })
	}
})

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
)
