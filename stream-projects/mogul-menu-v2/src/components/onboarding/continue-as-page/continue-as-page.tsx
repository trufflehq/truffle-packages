import {
  getSrcByImageObj,
  gql,
  React,
  useMutation,
  useStyleSheet,
} from "../../../deps.ts";
import { useOnLoggedIn } from "../mod.ts";
import {
  getCreatorName,
  getMenuIconImageObj,
  useMenu,
} from "../../menu/mod.ts";
import { Page } from "../../page-stack/mod.ts";
import { MeUserWithConnectionConnection } from "../../../types/mod.ts";
import Button from "../../base/button/button.tsx";

import stylesheet from "./continue-as-page.scss.js";

const ORG_USER_CREATE_MUTATION = gql`
mutation {
  orgUserCreate { orgUser { id } }
}
`;

export default function ContinueAsPage(
  { meWithConnectionConnection }: {
    meWithConnectionConnection: MeUserWithConnectionConnection;
  },
) {
  useStyleSheet(stylesheet);
  const { state: menuState } = useMenu();

  const [_orgUserCreateResult, executeOrgUserCreate] = useMutation(
    ORG_USER_CREATE_MUTATION,
  );

  const onLoggedIn = useOnLoggedIn();

  const joinOrg = async () => {
    const orgUserResponse = await executeOrgUserCreate();
    if (!orgUserResponse?.error) {
      onLoggedIn();
    }
  };

  const creatorName = getCreatorName(menuState);
  const continueText = meWithConnectionConnection?.name
    ? `Continue as ${meWithConnectionConnection.name}`
    : "Continue";

  return (
    <Page
      isFullSize
      shouldDisableEscape
      shouldShowHeader={false}
      isAnimated={false}
    >
      <div className="c-continue-as-page">
        <div
          className="logo"
          style={{
            backgroundImage: `url(${
              getSrcByImageObj(getMenuIconImageObj(menuState))
            })`,
          }}
        />
        <div className="title">
          Join the {creatorName} community
        </div>
        <div className="description">
          You’ve already created an account for another Truffle creator.
          Clicking continue will add you to the {creatorName} Truffle community.
        </div>
        <div className="button">
          <Button
            style="primary"
            size="large"
            onClick={joinOrg}
            shouldHandleLoading={true}
          >
            {continueText}
          </Button>
        </div>
      </div>
    </Page>
  );
}
