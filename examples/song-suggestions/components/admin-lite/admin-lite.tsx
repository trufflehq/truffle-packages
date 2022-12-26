import {
  Button,
  React,
  useEffect,
  useMutation,
  useState,
  useStyleSheet,
} from "../../deps.ts";

import LoadingSpinner from "../loading-spinner/loading-spinner.tsx";
import UserInfo from "../user-info/user-info.tsx";
import PollManager from "../poll-manager/poll-manager.tsx";
import PollHistory from "../poll-history/poll-history.tsx";
import SubmissionsList from "../submissions-list/submissions-list.tsx";
import Tabs from "../tabs/tabs.tsx";
import TabList from "../tab-list/tab-list.tsx";
import TabTrigger from "../tab-trigger/tab-trigger.tsx";
import TabPanel from "../tab-panel/tab-panel.tsx";

import {
  useFetchPoll,
  useGoogleFontLoader,
  useInterval,
} from "../../hooks/mod.ts";
import {
  fetchSubmissionCount,
  getClearSubmissionInput,
} from "../../api/mod.ts";
import { ACTION_EXECUTE_MUTATION } from "../../gql/mod.ts";
import { Poll, Submission } from "../../types/mod.ts";
import { hasPermission } from "../../utils/mod.ts";

import styleSheet from "./admin-lite.scss.js";

const COUNT_REFRESH_INTERVAL = 5 * 1000;

export default function Admin() {
  const [activeUser, setActiveUser] = useState();
  const [activeOrgUser, setActiveOrgUser] = useState();

  useStyleSheet(styleSheet);

  useGoogleFontLoader(() => {
    return ["Inter"];
  }, ["Inter"]);

  const hasAdminPerms = hasPermission(activeOrgUser, [
    "admin",
    "moderator",
    "mod",
  ]);
  console.log("activeUser", activeUser);
  console.log("hasAdminPerms", hasAdminPerms);

  return (
    <div className="c-admin">
      <header>
        <div className="title">
          Song Submission Dashboard
        </div>
      </header>
      <div className="auth">
        <UserInfo
          setActiveUser={setActiveUser}
          setActiveOrgUser={setActiveOrgUser}
        />
      </div>
      {hasAdminPerms
        ? <AdminDashboard />
        : activeOrgUser?.roleConnection && activeUser?.name
        ? (
          <div className="perms">
            Insufficient Permissions
          </div>
        )
        : null}
    </div>
  );
}

export interface RandomSubmissionProps {
  randomSubmission: Submission;
  setRandomSubmission: React.Dispatch<
    React.SetStateAction<Submission | null | undefined>
  >;
}

function AdminDashboard() {
  const latestPoll = useFetchPoll({});
  const [randomSubmission, setRandomSubmission] = useState();

  return (
    <main className="c-admin-dashboard">
      <PollManager
        latestPoll={latestPoll}
        randomSubmission={randomSubmission}
        setRandomSubmission={setRandomSubmission}
      />
      <AdminDashboardTabs
        latestPoll={latestPoll}
        randomSubmission={randomSubmission}
        setRandomSubmission={setRandomSubmission}
      />
    </main>
  );
}

function ClearButton({ onClearFn }: { onClearFn: () => void }) {
  const [isClearing, setIsClearing] = useState(false);
  const [clearSubmissionsResult, executeClearSubmissionsMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );
  const onClear = async () => {
    if (
      confirm("This will clear all submissions, including the approved ones")
    ) {
      setIsClearing(true);
      console.log("clear");
      const input = getClearSubmissionInput();
      await executeClearSubmissionsMutation(input);
      setIsClearing(false);
      onClearFn?.();
    }
  };

  return (
    <Button
      className="clear-button"
      onClick={onClear}
      disabled={isClearing}
    >
      {isClearing ? <LoadingSpinner size={24} /> : "Clear Submissions"}
    </Button>
  );
}

function Controls() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const refreshCount = async () => {
    const submissionCount = await fetchSubmissionCount();
    setSubmissionCount(submissionCount);
  };

  useEffect(() => {
    const initCount = async () => {
      await refreshCount();
    };

    initCount();
  }, []);

  useInterval(async () => {
    await refreshCount();
  }, COUNT_REFRESH_INTERVAL);

  return (
    <div className="c-controls">
      <ClearButton onClearFn={refreshCount} />
      {submissionCount
        ? (
          <div className="count">
            Submissions: {submissionCount}
          </div>
        )
        : null}
    </div>
  );
}

type AdminDashboardTabsProps = {
  latestPoll?: Poll;
} & RandomSubmissionProps;

function AdminDashboardTabs(props: AdminDashboardTabsProps) {
  return (
    <div className="tabs">
      <Tabs defaultValue="approved">
        <Controls />
        <TabList>
          <TabTrigger value="approved">
            Approved
          </TabTrigger>
          <TabTrigger value="history">
            History
          </TabTrigger>
        </TabList>
        <TabPanel value="approved">
          <SubmissionsList variant={"approved"} {...props} />
        </TabPanel>
        <TabPanel value="history">
          <PollHistory />
        </TabPanel>
      </Tabs>
    </div>
  );
}
