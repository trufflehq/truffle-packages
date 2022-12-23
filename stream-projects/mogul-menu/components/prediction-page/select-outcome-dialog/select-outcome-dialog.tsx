import {
  classKebab,
  Icon,
  Observable,
  React,
  useMutation,
  useSelector,
  useSignal,
  useStyleSheet,
} from "../../../deps.ts";
import { getOptionColor, TROPHY_ICON } from "../../../shared/mod.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import { Poll, PollOption } from "../../../types/mod.ts";
import { CHOOSE_PREDICTION_WINNER_MUTATION } from "../../prediction/gql.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import styleSheet from "./select-outcome-dialog.scss.js";

export default function SelectOutcomeDialog(
  { prediction$ }: { prediction$: Observable<Poll> },
) {
  const [, executeChoosePredictionWinnerMutation] = useMutation(
    CHOOSE_PREDICTION_WINNER_MUTATION,
  );
  const { popDialog } = useDialog();
  const error$ = useSignal("");
  useStyleSheet(styleSheet);
  const selectedOption$ = useSignal<PollOption>(undefined!);

  const onSubmit = async () => {
    error$.set("");

    try {
      const chooseWinnerResult = await executeChoosePredictionWinnerMutation({
        id: prediction$.id.get(),
        winningOptionIndex: selectedOption$.index.get(),
      });

      if (chooseWinnerResult.error) {
        console.error("error ending poll", chooseWinnerResult.error);
        error$.set(chooseWinnerResult.error.graphQLErrors[0]?.message);
        return;
      }

      popDialog();
    } catch (err) {
      error$.set(err.message);
    }
  };

  const onSelect = (option: PollOption) => {
    selectedOption$.set(option);
  };

  const onKeyPress = (e: React.KeyboardEvent, option: PollOption) => {
    if (e.key === "Enter") {
      selectedOption$.set(option);
    }
  };

  const error = useSelector(() => error$.get());
  const options = useSelector(() => prediction$.counter.options.get());
  const question = useSelector(() => prediction$.question.get());
  const hasSelectedOption = useSelector(() => Boolean(selectedOption$.get()));
  const selectedOption = useSelector(() => selectedOption$.get());

  return (
    <div className="c-select-outcome-dialog">
      <Dialog headerText="Select the outcome">
        <div className="body">
          <div className="question">{question}</div>
          <div className="options">
            {options.map((option) => (
              <div
                tabIndex={0}
                className={`option ${
                  classKebab({
                    isSelected: option.index === selectedOption?.index,
                  })
                }`}
                onKeyDown={(e) => onKeyPress(e, option)}
                onClick={() => onSelect(option)}
              >
                <div
                  className="color"
                  style={{ backgroundColor: getOptionColor(option.index) }}
                />
                <div className="text">
                  {option.text}
                  {option.index === selectedOption?.index && <WinnerIcon />}
                </div>
              </div>
            ))}
          </div>
          <div className="footer">
            {error ? <div className="error">{error}</div> : null}
            <Button
              isDisabled={!hasSelectedOption}
              style="primary"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function WinnerIcon() {
  return (
    <div className="c-winner">
      <Icon icon={TROPHY_ICON} color="#EBAD64" size="20px" />
      <div className="text">Winner</div>
    </div>
  );
}
