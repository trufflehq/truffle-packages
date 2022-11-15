import { legend, React, useComputed, useQuerySignal, useSelector, useSignal } from "../../deps.ts";
import { EVENT_TOPIC_QUERY } from "../../shared/gql/event-topic.ts";

export default function CreateCollectibleForm() {
  const slug$ = useSignal("");
  const description$ = useSignal("");

  // we need to retrieve the id for the correct event topic
  const eventTopic$ = useQuerySignal(EVENT_TOPIC_QUERY, {
    resourcePath: "@truffle/do-something/_EventTopic/do-something-redeem",
  });

  const collectibleDataJson$ = useComputed(() =>
    JSON.stringify(
      {
        category: null,
        redeemType: "event",
        redeemButtonText: "Redeem",
        redeemData: {
          eventTopicId: eventTopic$.eventTopic?.id?.get(),
          collectiblePath: `@truffle/do-something/_Collectible/${slug$.get()}`,
        },
        description: description$.get(),
      },
      null,
      2,
    )
  );
  // for some reason collectibleDataJson$.get() doesn't work, so we're doing this
  const collectibleDataJson = useSelector(collectibleDataJson$);

  return (
    <div className="c-create-collectible-form">
      <legend.input value$={slug$} placeholder="slug"></legend.input>
      <br />
      <legend.textarea value$={description$} placeholder="Description"></legend.textarea>
      <div>Copy and paste the following into the data field for the collectible.</div>
      <pre>
        {collectibleDataJson}
      </pre>
    </div>
  );
}
