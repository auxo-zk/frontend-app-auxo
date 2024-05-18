import React from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';

export default function ButtonFinalization() {
    async function finalize() {}
    return (
        <ButtonLoading isLoading={false} muiProps={{ onClick: finalize, variant: 'outlined', size: 'small' }}>
            Finalize
        </ButtonLoading>
    );
}
