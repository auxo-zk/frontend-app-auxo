import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/committees`,
    createCommittee: `${BACKEND_BASE_URL}/committees`,
    committeeKeys: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys`,
    committeeRequests: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/requests`,
    getStorageDkgZkapp: `${BACKEND_BASE_URL}/storages/dkg/zkapps`,
    getStorageRound1Zkapp: `${BACKEND_BASE_URL}/storages/round1/zkapps`,
    getStorageRound1PubkeyLv1: `${BACKEND_BASE_URL}/storages/round1/public-key/level1`,
    getStorageRound2Zkapp: `${BACKEND_BASE_URL}/storages/round2/zkapps`,
    getCommitteeMemberLv1: `${BACKEND_BASE_URL}/storages/committee/member/level1`,
    getCommitteeMemberLv2: (committeeId: string) => `${BACKEND_BASE_URL}/storages/committee/member/level2/${committeeId}`,
};
