import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import {
  useMutation,
  useQuery,
} from "https://tfl.dev/@truffle/api@~0.1.1/client.ts";
import {
  ACTION_EXECUTE_MUTATION,
  getCreateOrgUserCounterTypeInput,
  getUpdateConfigInput,
  getUpdateRemoteConfigInput,
  MASHING_CONFIG_MUTATION,
  MASHING_CONFIG_QUERY,
  ORG_USER_COUNTER_TYPE_UPSERT,
} from "../../api/gql.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import MashingLeaderboard from "../mashing-leaderboard/mashing-leaderboard.tsx";
import UserInfo from "../user-info/user-info.tsx";
import Timer from "../timer/timer.tsx";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./admin-dashboard.scss.js";
import { getMashTimeRemaining } from "../mash-controls/utils.ts";

type KeyValue = {
  key: string;
  value: string;
};

function parseKeyValue(keyValue: KeyValue) {
  return JSON.parse(keyValue.value || "{}");
}

export default function AdminDashboard() {
  const [activeUser, setActiveUser] = useState();
  const [config, setConfig] = useState();
  const [isCreatingConfig, setIsCreatingConfig] = useState(false);
  const [isEndEnabled, setIsEndEnabled] = useState(false);
  useStyleSheet(styleSheet);
  const [{ data: mashingConfig }] = useQuery({
    query: MASHING_CONFIG_QUERY,
    variables: {
      input: {
        key: "mashingConfig",
      },
    },
  });

  const context = globalContext.getStore();

  const [_m, executeMashingConfigMutation] = useMutation(
    MASHING_CONFIG_MUTATION,
  );
  const [_o, executeOrgUserCounterTypeUpsertMutation] = useMutation(
    ORG_USER_COUNTER_TYPE_UPSERT,
  );
  const [_a, executeActionMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );

  const parsedMashingConfig = JSON.parse(
    mashingConfig?.org?.keyValue?.value || "{}",
  );

  useEffect(() => {
    if (parsedMashingConfig) {
      setConfig(parsedMashingConfig);
    }
  }, [JSON.stringify(parsedMashingConfig)]);

  const updateMashingConfig = async (
    orgUserCounterTypeId: string,
    endTime: Date,
  ) => {
    const input = getUpdateConfigInput(orgUserCounterTypeId, endTime);
    const { data, errors } = await executeMashingConfigMutation(input, {
      additionalTypenames: ["KeyValue"],
    });

    if (errors) {
      console.error(JSON.stringify(errors));
    }

    const updatedConfig = data?.keyValueUpsert?.keyValue;

    setConfig(parseKeyValue(updatedConfig));
    return updatedConfig;
  };

  const createOrgUserCounterType = async () => {
    const input = getCreateOrgUserCounterTypeInput(context.orgId);
    const { data, error } = await executeOrgUserCounterTypeUpsertMutation(
      input,
      {
        additionalTypenames: ["OrgUserCounterType"],
      },
    );

    if (error) {
      console.error("error", error);
    }

    return data?.orgUserCounterTypeUpsert?.orgUserCounterType;
  };

  const updateRemoteConfig = async (updatedConfigKeyValue: KeyValue) => {
    const parsedUpdatedConfig = parseKeyValue(updatedConfigKeyValue);
    const input = getUpdateRemoteConfigInput(
      parsedUpdatedConfig.orgUserCounterTypeId,
      context.orgId,
      parsedUpdatedConfig.endTime,
    );
    const { data, error } = await executeActionMutation(input);

    if (error) {
      console.error(error);
    }

    return data?.orgUserCounterTypeUpsert?.orgUserCounterType;
  };

  const onEnd = async () => {
    await updateMashingConfig(
      config.orgUserCounterTypeId,
      new Date(Date.now()),
    );
  };

  const onStart = async () => {
    setIsCreatingConfig(true);
    // create the ouct
    const orgUserCounterType = await createOrgUserCounterType();

    // update the truffle kv
    const updatedConfigKeyValue = await updateMashingConfig(
      orgUserCounterType.id,
      new Date(Date.now() + 1000 * 10),
    );

    // update the admin config via webhook
    updateRemoteConfig(updatedConfigKeyValue);

    setIsCreatingConfig(false);
    setIsEndEnabled(true);
  };

  const timeRemaining = getMashTimeRemaining(parsedMashingConfig?.endTime);
  const hasRoundEnded = timeRemaining < 0;

  const onEndTimer = () => {
    setIsEndEnabled(false);
  };
  const isStartEnabled = parsedMashingConfig?.endTime && hasRoundEnded &&
    !isCreatingConfig;

  return (
    <div className="c-admin-dashboard">
      <div className="title" />
      <main>
        {!activeUser?.name && (
          <div className="auth">
            <UserInfo setActiveUser={setActiveUser} />
          </div>
        )}
        {activeUser?.name && (
          <>
            <div className="status">
              <Timer
                endTime={parsedMashingConfig?.endTime}
                onEnd={onEndTimer}
              />
            </div>
            <div className="controls">
              <Button
                className="button end"
                disabled={!isEndEnabled}
                onClick={onEnd}
              >
              </Button>
              <Button
                className="button start"
                disabled={!isStartEnabled}
                onClick={onStart}
              >
              </Button>
            </div>
            <div className="leaderboard">
              <MashingLeaderboard
                endTime={parsedMashingConfig?.endTime}
                orgUserCounterTypeId={config?.orgUserCounterTypeId}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
