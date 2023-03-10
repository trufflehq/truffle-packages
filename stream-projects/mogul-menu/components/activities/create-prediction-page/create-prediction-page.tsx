import {
  classKebab,
  gql,
  Icon,
  LabelPrimitive,
  Observable,
  observer,
  React,
  useComputed,
  useMutation,
  useObserve,
  useSelector,
  useSignal,
  useStyleSheet,
} from "../../../deps.ts";
import { useSnackBar } from "../../snackbar/mod.ts";
import PredictionCreatedSnackbar from "../prediction-created-snackbar/prediction-created-snackbar.tsx";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import Button from "../../base/button/button.tsx";
import Input, { InputProps } from "../../base/input/input.tsx";
import { getOptionColor } from "../../../shared/mod.ts";
import stylesheet from "./create-prediction-page.scss.js";

const SECONDS_PER_MINUTE = 60;
const MAX_PREDICTION_OPTIONS = 10;

const CREATE_PREDICTION_QUERY = gql`
mutation CreatePrediction($question: String, $options: JSON, $durationSeconds: Int) {
  pollUpsert(
    input: {
      question: $question
      options: $options
      durationSeconds: $durationSeconds,
      data: { type: "prediction" }
    }
  ) {
    poll {
      id
      question
      endTime
      counter {
        options {
          text
          index
        }
      }
      data
    }
  }
}
`;

interface PollOptionInput {
  text: string;
  index: number;
}

interface PollInput {
  question: string;
  options: PollOptionInput[];
  durationMinutes: string;
}

const CreatePredictionPage = observer(function CreatePredictionPage() {
  useStyleSheet(stylesheet);
  const [, executeCreatePredictionMutation] = useMutation(
    CREATE_PREDICTION_QUERY,
  );
  const { popPage } = usePageStack();
  const enqueueSnackBar = useSnackBar();
  const predictionError$ = useSignal("");
  const predictionForm$ = useSignal<PollInput>({
    question: "",
    options: [{ text: "", index: 0 }, { text: "", index: 1 }],
    durationMinutes: "0",
  });

  const onClick = async () => {
    const result = await executeCreatePredictionMutation({
      question: predictionForm$.question.get(),
      options: predictionForm$.options.get(),
      durationSeconds: parseFloat(predictionForm$.durationMinutes.get()) *
        SECONDS_PER_MINUTE,
    });

    if (result.error?.graphQLErrors?.length) {
      predictionError$.set(result.error.graphQLErrors[0].message);
    } else {
      popPage();
      enqueueSnackBar(<PredictionCreatedSnackbar />);
    }
  };

  const canSubmit = useComputed(() => {
    const hasQuestion = Boolean(predictionForm$.question.get().length);
    const hasDuration = parseFloat(predictionForm$.durationMinutes.get()) > 0;
    const hasOptions = predictionForm$.options.get().every((option) =>
      option.text.length
    );

    return hasQuestion && hasDuration && hasOptions;
  });

  return (
    <Page
      title="Start a prediction"
      shouldShowHeader
      footer={
        <div className="c-create-prediction-page__footer">
          <Button
            style={"primary"}
            onClick={onClick}
            shouldHandleLoading
            isDisabled={!canSubmit.get()}
          >
            Start prediction
          </Button>
        </div>
      }
    >
      <div className="c-create-prediction-page">
        {predictionError$.get() && (
          <div className="error">{predictionError$.get()}</div>
        )}
        <Input label="Question" value$={predictionForm$.question} />
        <CreatePollOptions predictionForm$={predictionForm$} />
        <SubmissionPeriod durationMinutes$={predictionForm$.durationMinutes} />
      </div>
    </Page>
  );
});

function SubmissionPeriod(
  { durationMinutes$ }: { durationMinutes$: Observable<string> },
) {
  const error$ = useSignal("");

  useObserve(() => {
    const durationMinutes = parseFloat(durationMinutes$.get());
    if (durationMinutes < 0) {
      error$.set("Must be a positive value");
    } else {
      error$.set("");
    }
  });

  return (
    <div className="c-submission-period">
      <div className="title">
        SUBMISSION PERIOD
      </div>
      <div className="duration">
        <DurationInput
          suffix="min"
          value$={durationMinutes$}
          error$={error$}
        />
      </div>
    </div>
  );
}

interface DurationInputProps extends InputProps {
  suffix?: string;
}

function DurationInput({ value$, error$, suffix = "min" }: DurationInputProps) {
  const error = useSelector(() => error$?.get());

  return (
    <div
      className={`c-number-input ${
        classKebab({
          hasSuffix: !!suffix,
          hasError: !!error,
        })
      }`}
    >
      <LabelPrimitive.Root className="label">
        How long do viewers have submit their guess?
      </LabelPrimitive.Root>
      <div className="input">
        <Input value$={value$} error$={error$} type="number" />
        {suffix && (
          <div className="suffix">
            {suffix}
          </div>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function CreatePollOptions(
  { predictionForm$ }: { predictionForm$: Observable<PollInput> },
) {
  const onAddOption = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    predictionForm$.options.set((existingOptions) =>
      existingOptions.concat({ text: "", index: existingOptions.length })
    );
  };

  const onRemoveOption = (option: PollOptionInput) => {
    predictionForm$.options.set((existingOptions) =>
      existingOptions
        .filter((existingOption) => existingOption.index !== option.index)
        .map((option, i) => ({ ...option, index: i }))
    );
  };

  const options = useSelector(() => predictionForm$.options.get());

  return (
    <div className="c-create-poll-options">
      <div className="title">
        POSSIBLE OUTCOMES
      </div>
      <div className="options">
        {predictionForm$.options.map((option$, i) => (
          <PollOptionInput
            color={getOptionColor(i)}
            placeholder={`Option ${i + 1}`}
            value$={option$.text}
            onRemove={() => onRemoveOption(option$.get())}
          />
        ))}
        <Button
          isDisabled={options.length >= MAX_PREDICTION_OPTIONS}
          className="add-option"
          onClick={onAddOption}
        >
          <Icon icon="add" size="20px" />
          Add option
        </Button>
      </div>
    </div>
  );
}

interface PollOptionInputProps extends InputProps {
  color: string;
  onRemove: () => void;
}

function PollOptionInput(
  { color, ...props }: PollOptionInputProps,
) {
  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onRemove();
  };
  return (
    <div className="c-poll-option-input">
      <div className="block" style={{ backgroundColor: color }} />
      <Input
        css={{
          border: "none",
          backgroundColor: "var(--mm-color-bg-tertiary)",
        }}
        {...props}
      />
      <div className="close" onClick={onRemove}>
        <Icon icon="close" size="20px" />
      </div>
    </div>
  );
}

export default CreatePredictionPage;
