import { TruffleQuerySignal, useMutation, useQuery, useQuerySignal } from "../../../deps.ts";
import { OrgUser, OrgUserChatSettings } from "../../../types/mod.ts";
import { invalidateExtensionUser } from "../jumper/util.ts";
import {
  ORG_USER_CHAT_SETTINGS_QUERY,
  ORG_USER_WITH_ROLES_QUERY,
  SAVE_ORG_USER_SETTINGS_MUTATION,
} from "./gql.ts";

export function useSaveOrgUserSettings(
  onSave?: () => void,
  onError?: (err: string) => void,
) {
  const [, saveSettings] = useMutation(SAVE_ORG_USER_SETTINGS_MUTATION);

  const saveOrgUserSettings = async (
    orgUser: OrgUserChatSettings,
    username?: string,
    nameColor?: string,
  ) => {
    const { error } = await saveSettings({
      orgUserId: orgUser.id,
      userId: orgUser.user.id,
      username,
      nameColor,
    }, {
      additionalTypenames: ["MeUser", "User", "OrgUser", "Connection", "ConnectionConnection"],
    });

    invalidateExtensionUser();

    if (error) {
      console.error(error);
      onError?.(error.message);
    } else {
      onSave?.();
    }
  };

  return { saveOrgUserSettings };
}

export function useOrgUserChatSettings() {
  const [{ data, fetching }] = useQuery({
    query: ORG_USER_CHAT_SETTINGS_QUERY,
  });

  return {
    orgUser: data?.orgUser as OrgUserChatSettings,
    isFetching: fetching,
  };
}

export function useOrgUserWithRoles$() {
  const orgUserWithRoles$ = useQuerySignal(ORG_USER_WITH_ROLES_QUERY);

  return orgUserWithRoles$;
}

export type OrgUserQuerySignal = TruffleQuerySignal<{ orgUser: OrgUser }>;
