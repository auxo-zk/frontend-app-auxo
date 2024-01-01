export enum LocalStorageKey {
    'IsConnected' = 'isConnected',
}

export enum LocalStorageValue {
    'IsConnectedYes' = 'yes',
    'IsConnectedNo' = 'no',
}

export enum FetchStatus {
    IDLE = 'idle',
    FETCHING = 'fetching',
    UPDATING = 'updating',
    SUCCESS = 'success',
    FAILED = 'failed',
}
