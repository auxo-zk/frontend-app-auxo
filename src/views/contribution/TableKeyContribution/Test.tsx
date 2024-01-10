import { generateRandomPolynomial, getRound1Contribution } from '@auxo-dev/dkg';
import { Box } from '@mui/material';
import React from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';
import { LocalStorageKey } from 'src/constants';

export default function Test() {
    function generateContribution() {
        const secret = generateRandomPolynomial(2, 3);
        const contribution = getRound1Contribution(secret);
        console.log(secret);
        localStorage.setItem(LocalStorageKey.secretRound1Contribution, JSON.stringify(secret));
    }

    return (
        <Box>
            <ButtonLoading muiProps={{ size: 'small', onClick: () => generateContribution() }} isLoading={false}>
                Submit Contribution
            </ButtonLoading>
        </Box>
    );
}
