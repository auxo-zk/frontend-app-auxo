import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/committees`,
    createCommittee: `${BACKEND_BASE_URL}/committees`,
    committeeKeys: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys`,
    committeeKeyDetail: (committeeId: string, keyId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys/${keyId}`,
    committeeRequests: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/requests`,
    getStorageDkgZkapp: `${BACKEND_BASE_URL}/storages/dkg/zkapps`,
    getStorageRound1Zkapp: `${BACKEND_BASE_URL}/storages/round1/zkapps`,
    getStorageRound1PubkeyLv1: `${BACKEND_BASE_URL}/storages/round1/public-key/level1`,
    getStorageRound1PubkeyLv2: (level1Index: string) => `${BACKEND_BASE_URL}/storages/round1/public-key/level2/${level1Index}`,
    getStorageRound2Zkapp: `${BACKEND_BASE_URL}/storages/round2/zkapps`,
    getStorageRound2EncryptionLv1: `${BACKEND_BASE_URL}/storages/round2/encryption/level1`,
    getStorageRound2EncryptionLv2: (level1Index: string) => `${BACKEND_BASE_URL}/storages/round2/encryption/level2/${level1Index}`,
    getCommitteeMemberLv1: `${BACKEND_BASE_URL}/storages/committee/member/level1`,
    getCommitteeMemberLv2: (committeeId: string) => `${BACKEND_BASE_URL}/storages/committee/member/level2/${committeeId}`,
    getStorageResponseZkapp: `${BACKEND_BASE_URL}/storages/response/zkApps`,
};
