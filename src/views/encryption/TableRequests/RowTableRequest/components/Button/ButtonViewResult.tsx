import React from 'react';
import ButtonLoading from 'src/components/ButtonLoading/ButtonLoading';

export default function ButtonViewResult() {
    async function view() {}
    return (
        <ButtonLoading isLoading={false} muiProps={{ onClick: view, variant: 'outlined', size: 'small' }}>
            View Result
        </ButtonLoading>
    );
}
