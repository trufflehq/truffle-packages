import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import { useMutation, useQuery } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import {
  ACTION_EXECUTE_MUTATION,
  getUpdateRemoteConfigInput,
  getCreateOrgUserCounterTypeInput,
  getUpdateConfigInput,
  MASHING_CONFIG_MUTATION,
  MASHING_CONFIG_QUERY,
  ORG_USER_COUNTER_TYPE_UPSERT,
} from "../../api/gql.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";
import MashingLeaderboard from '../mashing-leaderboard/mashing-leaderboard.tsx'
import UserInfo from "../user-info/user-info.tsx";
import Timer from "../timer/timer.tsx";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./admin-dashboard.scss.js";

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

  const parsedMashingConfig = JSON.parse(mashingConfig?.org?.keyValue?.value || "{}");

  useEffect(() => {
    if (parsedMashingConfig) {
      setConfig(parsedMashingConfig);
    }
  }, [JSON.stringify(parsedMashingConfig)]);

  const updateMashingConfig = async (orgUserCounterTypeId: string, endTime: Date) => {
    const input = getUpdateConfigInput(orgUserCounterTypeId, endTime);
    const { data, errors } = await executeMashingConfigMutation(input, {
      additionalTypenames: ["KeyValue"],
    });

    if (errors) {
      alert(JSON.stringify(errors));
    }

    const updatedConfig = data?.keyValueUpsert?.keyValue;

    setConfig(parseKeyValue(updatedConfig));
    return updatedConfig;
  };

  const createOrgUserCounterType = async () => {
    const input = getCreateOrgUserCounterTypeInput(context.orgId);
    const { data, error } = await executeOrgUserCounterTypeUpsertMutation(input, {
      additionalTypenames: ["OrgUserCounterType"],
    });

    // FIXME
    if (error) {
      alert(error);
    }

    return data?.orgUserCounterTypeUpsert?.orgUserCounterType;
  };

  const updateRemoteConfig = async (updatedConfigKeyValue: KeyValue) => {
    const parsedUpdatedConfig = parseKeyValue(updatedConfigKeyValue);
    const input = getUpdateRemoteConfigInput(parsedUpdatedConfig.orgUserCounterTypeId, context.orgId, parsedUpdatedConfig.endTime);
    const { data, error } = await executeActionMutation(input);

    // FIXME
    if (error) {
      alert(error);
    }

    return data?.orgUserCounterTypeUpsert?.orgUserCounterType;
  };

  const onEnd = async () => {
    await updateMashingConfig(config.orgUserCounterTypeId, new Date(Date.now()));
  };

  const onStart = async () => {
    // create the ouct
    const orgUserCounterType = await createOrgUserCounterType();

    // update the truffle kv
    const updatedConfigKeyValue = await updateMashingConfig(orgUserCounterType.id, new Date(Date.now() + 1000 * 90));

    // update the admin config via webhook
    updateRemoteConfig(updatedConfigKeyValue);
  };

  return (
    <div className="c-admin-dashboard">
      <h2 className="title">
        Mashing Minigame Admin
      </h2>
      <main>
        {!activeUser && (
          <div className="auth">
            <UserInfo setActiveUser={setActiveUser} />
          </div>
        )}
        {parsedMashingConfig?.endTime && (
          <div className="status">
            <Timer endTime={parsedMashingConfig?.endTime} />
          </div>
        )}
        <div className="controls">
          <Button
            className="secondary-button"
            onClick={onEnd}
          >
            End
          </Button>
          <Button
            className="primary-button"
            onClick={onStart}
          >
            Start
          </Button>
        </div>

        <div className="leaderboard">
          <MashingLeaderboard orgUserCounterTypeId={config?.orgUserCounterTypeId} />
        </div>
      </main>
    </div>
  );
}
