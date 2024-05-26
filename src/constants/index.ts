export enum LocalStorageKey {
    'IsConnected' = 'isConnected',
    'secretRound1Contribution' = 'secretRound1Contribution',
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

export enum NetworkName {
    'Berkeley' = 'Berkeley',
    'AuxoNetwork' = 'AuxoNetwork',
    'Mainnet' = 'Mainnet',
}
