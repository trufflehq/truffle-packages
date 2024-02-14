import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { MothertreeClient } from '../src';

describe('mt-client.ts', () => {
  const accessToken =
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJzdWIiOiJkZjFiMTQwMC1iNjQwLTExZWUtOWViNS1jY2JjMzBjZjhlYzUiLCJub25jZSI6MCwidHlwZSI6InBhY2thZ2VJbnN0YWxsIiwiaXNBbm9uIjpmYWxzZSwib3JnSWQiOiI2MzA1ZjUyMC1iNmZkLTExZWUtYjViMi1lZDYxZGU1ZDM2NmYiLCJvcmdNZW1iZXJJZCI6IjIxMTA4ZTI4LWI2OWYtMTFlZS04NWIyLWRjOGU4Nzk2NjI5YSIsInBhY2thZ2VJZCI6ImEwOThiZTkwLWI2ZmQtMTFlZS04MTVlLTkwMTgxZDczZTE3YiIsInBhY2thZ2VJbnN0YWxsSWQiOiJkMDljMmI1MC1iNzAxLTExZWUtYjFiYi0zN2U3YmFhZjRmMjIiLCJpYXQiOjE3MDU5NjIyMzYsImlzcyI6InRydWZmbGUifQ.3nnJAQFiGTtU0U609VjVNSLGxKAMMASaDE_tNEBkyIOvFPGnsohZnxyFhio7IM2qR8h4Z11I_1Er8lJjrHvT6w';

  test('createMtClient', async () => {
    const client = new MothertreeClient({
      accessToken,
    });

    client.close();
  });

  describe('client operations', () => {
    let client: MothertreeClient;
    beforeAll(() => {
      client = new MothertreeClient({
        accessToken,
      });
    });

    afterAll(() => {
      client.close();
    });

    test('get userId', async () => {
      expect(client.userId).not.toBeUndefined();
    });

    test('get orgId', async () => {
      expect(client.orgId).not.toBeUndefined();
    });

    test('get orgMemberId', async () => {
      expect(client.orgMemberId).not.toBeUndefined();
    });

    test('get appId', async () => {
      expect(client.appId).not.toBeUndefined();
    });

    test('get appInstallId', async () => {
      expect(client.appInstallId).not.toBeUndefined();
    });

    test('fetch orgMember', async () => {
      const orgMember = await client.getOrgMember();
      console.log('Org member:', orgMember);
    });

    test('fetch org', async () => {
      const org = await client.getOrg();
      console.log('Org:', org);
    });

    test('fetch roles', async () => {
      const roles = (await client.getRoles()) as any;
      console.log('Roles:', roles);
    });

    test('get spark balance', async () => {
      const sparkBalance = await client.getSparkBalance();
      console.log('Spark balance:', sparkBalance);
    });

    test('purchase product variant', async () => {
      const productVariantPurchase = await client.purchaseProductVariant(
        '@truffle/tips/_ProductVariant/peepo-rage-theme'
      );
      console.log('Product variant purchase:', productVariantPurchase);
    });
  });

  describe('client operations without connecting to mothertree', () => {
    let client: MothertreeClient;
    beforeAll(() => {
      client = new MothertreeClient({
        accessToken,

        // set wsClient to null to prevent connecting to mothertree
        wsClient: null,
      });
    });

    afterAll(() => {
      client.close();
    });

    test('get userId', async () => {
      expect(client.userId).not.toBeUndefined();
    });

    test('get orgId', async () => {
      expect(client.orgId).not.toBeUndefined();
    });

    test('get orgMemberId', async () => {
      expect(client.orgMemberId).not.toBeUndefined();
    });

    test('get appId', async () => {
      expect(client.appId).not.toBeUndefined();
    });

    test('get appInstallId', async () => {
      expect(client.appInstallId).not.toBeUndefined();
    });
  });
});
