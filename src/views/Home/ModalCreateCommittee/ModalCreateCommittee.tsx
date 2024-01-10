import { Add, RemoveCircleOutlineRounded, RemoveCircleRounded } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { postCreateCommittee } from 'src/services/services';
import { useContractData } from 'src/states/contracts/committee';
import { useWalletData } from 'src/states/wallet';
import { v4 as uuidv4 } from 'uuid';
import { Field, PublicKey, fetchAccount, Mina } from 'o1js';
import { IPFSHash } from '@auxo-dev/auxo-libs';
// import { MemberArray } from '@auxo-dev/dkg/build/types/src/contracts/Committee';
import { ZkApp, Libs } from '@auxo-dev/dkg';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
export type TDataPost = {
    name: string;
    creator: string;
    network: string;
    t: number;
    n: number;
    members: { name: string; address: string; id: string }[];
};

export default function ModalCreateCommittee() {
    const { userAddress, userPubKey } = useWalletData();
    const { workerClient } = useContractData();
    const [dataPost, setDataPost] = useState<TDataPost>({ creator: userAddress, network: 'Berkery', t: 1, n: 1, members: [{ id: uuidv4(), address: '', name: '' }], name: '' });

    function changeDataPost(dataPost: Partial<TDataPost>) {
        return setDataPost((prev) => {
            return {
                ...prev,
                ...dataPost,
            };
        });
    }

    function changeMemberData(index: number, data: Partial<TDataPost['members'][0]>) {
        setDataPost((prev) => {
            return {
                ...prev,
                members: prev.members.map((item, i) => {
                    if (index == i) {
                        return { ...item, ...data };
                    }
                    return item;
                }),
            };
        });
    }
    function addMemberAddress() {
        setDataPost((prev) => {
            const member = [...prev.members];
            member.push({ address: '', name: '', id: uuidv4() });
            return {
                ...prev,
                n: member.length,
                members: member,
            };
        });
    }
    function removeMember(index: number) {
        setDataPost((prev) => {
            const member = [...prev.members];
            member.splice(index, 1);
            const t = prev.t > member.length ? member.length : prev.t;
            return {
                ...prev,
                n: member.length,
                t: t,
                members: member,
            };
        });
    }

    function changeT(value: string) {
        const valueToNumber = Number(value);
        if (isNaN(valueToNumber)) return;

        setDataPost((prev) => {
            if (valueToNumber > prev.n) return prev;
            return {
                ...prev,
                t: valueToNumber,
            };
        });
    }

    function checkValid() {
        if (!dataPost.name) {
            toast('Name of committee is required!', { type: 'error', position: 'top-center' });
            return false;
        }
        if (!dataPost.creator) {
            toast('Creator is required! Connect your wallet first!', { type: 'error', position: 'top-center' });
            return false;
        }
        if (!dataPost.network) {
            toast('Select network is required!', { type: 'error', position: 'top-center' });
            return false;
        }
        if (!dataPost.members.every((member) => member.address != '')) {
            toast('Member address should not be empty!', { type: 'error', position: 'top-center' });
            return false;
        }

        return true;
    }

    async function createCommitee() {
        if (checkValid()) {
            try {
                if (userAddress == null) throw new Error('You have not connected to your wallet yet!');
                if (workerClient == null) throw new Error('Worker client failed!');
                const response = await postCreateCommittee({
                    name: dataPost.name,
                    creator: dataPost.creator,
                    members: dataPost.members.map((item, index) => {
                        return {
                            alias: item.name,
                            memberId: index,
                            publicKey: item.address,
                        };
                    }),
                    threshold: dataPost.t,
                });
                const ipfsHash = response.Hash;
                console.log(ipfsHash);
                await workerClient?.fetchAccount(userAddress);

                await workerClient?.createCommittee({
                    sender: userAddress,
                    action: {
                        addresses: dataPost.members.map((member) => member.address),
                        threshold: dataPost.t,
                        ipfsHash: ipfsHash,
                    },
                });

                toast('Create transaction and proving...', { type: 'info', position: 'top-center' });
                await workerClient?.proveTransaction();

                const transactionJSON = await workerClient.getTransactionJSON();
                console.log(transactionJSON);
                const { transactionLink } = await workerClient.sendTransaction(transactionJSON);
                console.log(transactionLink);

                toast('Send transaction successful!', { type: 'success', position: 'top-center' });
            } catch (error) {
                console.log(error);
                toast((error as Error).message, { type: 'error', position: 'top-center' });
            }
        }
    }

    return (
        <Box>
            <Typography variant="body2" fontWeight={600}>
                Creator Address:
            </Typography>
            <Typography mb={3} variant="body2" fontWeight={500}>
                {dataPost.creator}
            </Typography>
            <TextField sx={{ mb: 3 }} label="Committee Name" fullWidth type="text" name="name_committee" value={dataPost.name} onChange={(e) => changeDataPost({ name: e.target.value })} />
            {/* <Box sx={{ display: 'flex', placeItems: 'center', gap: 3 }}>
                <TextField fullWidth label="Creator Address" type="text" name="creator_committee" value={dataPost.creator} onChange={(e) => changeDataPost({ creator: e.target.value })} />
            </Box> */}

            <Box>
                <TextField
                    fullWidth
                    value={dataPost.t}
                    helperText={`T out of N. Number of Committee member. N = ${dataPost.n}`}
                    onChange={(e) => changeT(e.target.value)}
                    variant="outlined"
                    label="Usage Threshold T"
                    type="text"
                    name="t_committee"
                />
            </Box>

            <Box mt={3}>
                <Box sx={{ display: 'flex' }} mb={2}>
                    <Typography color={'primary.main'} fontWeight={600}>
                        Committee Members
                    </Typography>
                    <Button variant="outlined" sx={{ ml: 'auto' }} onClick={addMemberAddress} size="small">
                        Add
                    </Button>
                </Box>

                {dataPost.members.map((member, index) => {
                    return (
                        <Box key={member.id} sx={{ display: 'flex', gap: 2, placeItems: 'center', cursor: 'pointer', mb: 1 }}>
                            <Typography variant="body2" fontWeight={600} color={'primary.main'}>
                                #{(index + 1).toString().padStart(2, '0')}
                            </Typography>
                            <TextField
                                value={dataPost.members[index].name}
                                onChange={(e) => changeMemberData(index, { name: e.target.value })}
                                fullWidth
                                variant="outlined"
                                label={`Alias (optional)`}
                                type="text"
                                name="name_member_committee"
                            />
                            <TextField
                                value={dataPost.members[index].address}
                                onChange={(e) => changeMemberData(index, { address: e.target.value })}
                                fullWidth
                                variant="outlined"
                                label={`Address`}
                                type="text"
                                name="address_member_committee"
                            />

                            <RemoveCircleOutlineRounded
                                sx={{ fontSize: '25px', display: dataPost.members.length == 1 ? 'none' : 'block', opacity: 0.66, color: 'primary.light' }}
                                onClick={() => removeMember(index)}
                            />
                        </Box>
                    );
                })}
            </Box>

            <Box mt={5} textAlign={'right'}>
                <ButtonCreate onClick={createCommitee} />
            </Box>
        </Box>
    );
}

function ButtonCreate({ onClick }: { onClick: () => Promise<void> }) {
    const [loading, setLoading] = useState<boolean>(false);
    async function _onClick() {
        setLoading(true);
        await onClick();
        setLoading(false);
    }
    return (
        <ButtonLoading muiProps={{ variant: 'contained', onClick: () => _onClick() }} isLoading={loading}>
            Create
        </ButtonLoading>
    );
}
