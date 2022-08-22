export interface OrgUserCounterType {
  id: string
  slug: string
  name: string
  decimalPlaces: number
}
export type OrgUserCounterTypePayload = {
  data: {
    orgUserCounterType: OrgUserCounterType
  };
};