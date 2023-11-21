import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Add } from 'testing_adding_number/build/src/contract/Add';
import { Field, Mina, PublicKey, fetchAccount } from 'o1js';
import { useWalletData } from 'src/states/wallet';
import Test from 'src/views/committee/test/Test';

export default function Committee() {
    const { userPubKey } = useWalletData();
    const [compiling, setConpiling] = useState<boolean>(true);
    const [statusAddOne, setStatusAddOne] = useState<string>('...');
    const [num, setNum] = useState<string>('...');
    const [zkAppPubkey, setZkAppPubkey] = useState<PublicKey | null>(null);
    const [zkApp, setApp] = useState<Add | null>(null);

    async function getNumber() {
        if (zkApp) {
            setNum('Loading...');

            try {
                await fetchAccount({ publicKey: zkAppPubkey! });
                setNum(zkApp.num.get().toString());
            } catch (err) {
                setNum((err as Error).message);
            }
        }
    }
    async function addToNum() {
        setStatusAddOne('Loading...');
        try {
            if (userPubKey) {
                const sender = userPubKey;
                if (zkApp) {
                    await fetchAccount({ publicKey: sender });

                    setStatusAddOne('Creating transaction...');
                    const tx = await Mina.transaction(sender, () => {
                        zkApp!.addNumber(new Field(1));
                    });

                    setStatusAddOne('Create done. Proving tx...');
                    await tx.prove();

                    const transactionJSON = tx.toJSON();
                    console.log(transactionJSON);

                    let transactionFee = 0.1;

                    setStatusAddOne('Sending transaction...');
                    const { hash } = await window.mina!.sendTransaction({
                        transaction: transactionJSON,
                        feePayer: {
                            fee: transactionFee,
                            memo: '',
                        },
                    });

                    const transactionLink = `https://berkeley.minaexplorer.com/transaction/${hash}`;
                    console.log(transactionLink);
                }
            }
        } catch (err) {
            console.log(err);
        }
        setStatusAddOne('...');
    }

    useEffect(() => {
        (async () => {
            await Add.compile();
            const zkappPublicKey = PublicKey.fromBase58('B62qn5Tmm1x2nC8UEnSMdEcMQW3KZEk1e7Pc4JyPmYy1nbQ9MoB9Gyd');
            const _zkapp = new Add!(zkappPublicKey);
            setApp(_zkapp);
            setZkAppPubkey(zkappPublicKey);
            setConpiling(false);
        })();
    }, []);
    return (
        <Container>
            {compiling ? (
                <Typography textAlign={'center'}>Compiling contract Add......</Typography>
            ) : (
                <>
                    <Box style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Typography style={{ padding: 0 }}>Current state in zkApp: {num} </Typography>
                        <Button variant="contained" onClick={addToNum}>
                            Send Transaction
                        </Button>
                        | {statusAddOne}
                        <br />
                        <br />
                        <br />
                        <Button variant="outlined" onClick={getNumber}>
                            Get Latest State
                        </Button>{' '}
                        | {num}
                    </Box>
                </>
            )}

            <br />
            <br />
            <br />
            <Test />
        </Container>
    );
}
