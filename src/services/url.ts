import { addressDefault } from 'src/constants/address';
import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/committees`,
    createCommittee: `${BACKEND_BASE_URL}/committees`,
    committeeKeys: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys`,
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

    ///////////////////
    getGenerateNewKeyData: (memberId: string, committeeId: string) => `${BACKEND_BASE_URL}/method-inputs/dkg-contract/generate-key?committeeId=${committeeId}&memberId=${memberId}`,
    getRound1Contribution: (memberId: string, committeeId: string) => `${BACKEND_BASE_URL}/method-inputs/round1-contract/contribute?committeeId=${committeeId}&memberId=${memberId}`,
    getRound2Contribution: (memberId: string, committeeId: string, keyId: string) =>
        `${BACKEND_BASE_URL}/method-inputs/round2-contract/contribute?committeeId=${committeeId}&keyId=${keyId}&memberId=${memberId}`,
    committeeKeyDetail: (committeeId: string, keyId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys/${keyId}`,
    committeeRequestsDetail: (committeeId: string, requestId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/requests/${requestId}`,
    getResponseContribution: (committeeId: string, keyId: string, memberId: string, requestId: string) =>
        `${BACKEND_BASE_URL}/method-inputs/response-contract/contribute?committeeId=${committeeId}&keyId=${keyId}&memberId=${memberId}&requestId=${requestId}`,

    getRequestByKeyIndex: (keyIndex: string) => `${BACKEND_BASE_URL}/requests?keyIndex=${keyIndex}`,
    getRequestByRequestId: (requestId: string) => `${BACKEND_BASE_URL}/requests/${requestId}`,
    getTasksByKeyIndex: (keyIndex: string) => `${BACKEND_BASE_URL}/tasks?requester=${addressDefault.requester}&keyIndex=${keyIndex}&hasRequest=false`,

    getDataCreateTask: `${BACKEND_BASE_URL}/method-inputs/requester-contract/create-task?requesterAddress=${addressDefault.requester}`,
    getDataFinalizeTask: (taskId: string) => `${BACKEND_BASE_URL}/method-inputs/requester-contract/finalize?requesterAddress=${addressDefault.requester}&taskId=${taskId}`,
    getDataSubmitEncryptionTask: (taskId: string) => `${BACKEND_BASE_URL}/method-inputs/requester-contract/submit-encryption?requesterAddress=${addressDefault.requester}&taskId=${taskId}`,
};
