import { BACKEND_BASE_URL } from './baseUrl';

export const apiUrl = {
    listCommittee: `${BACKEND_BASE_URL}/committees`,
    createCommittee: `${BACKEND_BASE_URL}/committees`,
    committeeKeys: (committeeId: string) => `${BACKEND_BASE_URL}/committees/${committeeId}/keys`,
    getStorageDkgZkapp: `${BACKEND_BASE_URL}/storages/dkg/zkapps`,
};
