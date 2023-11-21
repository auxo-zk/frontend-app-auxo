import { RemoveCircleRounded } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useWalletData } from 'src/states/wallet';
import { v4 as uuidv4 } from 'uuid';

export type TDataPost = {
    name: string;
    creator: string;
    network: string;
    t: number;
    n: number;
    members: { address: string; id: string }[];
};

export default function ModalCreateCommittee() {
    const { userAddress } = useWalletData();
    const [dataPost, setDataPost] = useState<TDataPost>({ creator: userAddress, network: '', t: 0, n: 1, members: [], name: '' });

    function changeDataPost(dataPost: Partial<TDataPost>) {
        return setDataPost((prev) => {
            return {
                ...prev,
                ...dataPost,
            };
        });
    }

    function changeAddressMember(index: number, value: string) {
        setDataPost((prev) => {
            return {
                ...prev,
                members: prev.members.map((item, i) => {
                    if (index == i) {
                        return { ...item, address: value };
                    }
                    return item;
                }),
            };
        });
    }
    function addMemberAddress() {
        setDataPost((prev) => {
            if (prev.members.length < prev.n) {
                const member = [...prev.members];
                member.push({ address: '', id: uuidv4() });
                return {
                    ...prev,
                    t: member.length,
                    members: member,
                };
            }
            return prev;
        });
    }
    function removeMember(index: number) {
        setDataPost((prev) => {
            const member = [...prev.members];
            member.splice(index, 1);
            return {
                ...prev,
                t: member.length,
                members: member,
            };
        });
    }

    return (
        <Box>
            <TextField variant="outlined" label="Name" type="text" name="name_committee" value={dataPost.name} onChange={(e) => changeDataPost({ name: e.target.value })} />
            <br />
            <br />
            <Box sx={{ display: 'flex', placeItems: 'center' }}>
                <TextField variant="outlined" label="Creator" type="text" name="creator_committee" sx={{ mr: 5 }} value={dataPost.creator} />

                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="create-committee-label">Network</InputLabel>
                    <Select labelId="create-committee-label" label="Network" value={dataPost.network} onChange={(e) => changeDataPost({ network: e.target.value as string })}>
                        <MenuItem value={'Berkery'}>Berkery</MenuItem>
                        <MenuItem value={'Devnet'}>Devnet</MenuItem>
                        <MenuItem value={'Mainnet'}>Mainnet</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box mt={3}>
                <Typography mb={2}>{'Usage Threshold (T out of N)'}</Typography>
                <TextField value={dataPost.t} variant="outlined" label="T" type="text" name="t_committee" sx={{ width: '150px', mr: 3 }} />
                <TextField value={dataPost.n} onChange={(e) => changeDataPost({ n: Number(e.target.value) })} variant="outlined" label="N" type="text" name="n_committee" sx={{ width: '150px' }} />
            </Box>

            <Box mt={3}>
                <Typography mb={2}>{'Committee Members (Mina Address)'}</Typography>

                {dataPost.members.map((member, index) => {
                    return (
                        <Box key={member.id} sx={{ display: 'flex', gap: 2, placeItems: 'center', cursor: 'pointer' }}>
                            <TextField
                                value={dataPost.members[index].address}
                                onChange={(e) => changeAddressMember(index, e.target.value)}
                                fullWidth
                                variant="outlined"
                                label={`#${(index + 1).toString().padStart(2, '0')}`}
                                type="text"
                                name="address_member_committee"
                                sx={{ mb: 1 }}
                            />
                            <RemoveCircleRounded sx={{ fontSize: '25px' }} onClick={() => removeMember(index)} />
                        </Box>
                    );
                })}

                <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={addMemberAddress}>
                    {"Add member's address"}
                </Button>
            </Box>

            <Box mt={5} textAlign={'right'}>
                <Button variant="contained">Create</Button>
            </Box>
        </Box>
    );
}
