import React from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';

export default function ButtonSubmission() {
    async function submit() {}
    return (
        <ButtonLoading isLoading={false} muiProps={{ onClick: submit, variant: 'outlined', size: 'small' }}>
            Submit Encryption
        </ButtonLoading>
    );
}
