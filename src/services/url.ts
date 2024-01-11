import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/committees`,
    createCommittee: `${BACKEND_BASE_URL}/committees`,
    committeeKeys: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys`,
    getStorageDkgZkapp: `${BACKEND_BASE_URL}/storages/dkg/zkapps`,
    getStorageRound1Zkapp: `${BACKEND_BASE_URL}/storages/round1/zkapps`,
    getCommitteeMemberLv1: `${BACKEND_BASE_URL}/storages/committee/member/level1`,
    getCommitteeMemberLv2: (committeeId: string) => `${BACKEND_BASE_URL}/storages/committee/member/level2/${committeeId}`,
};
