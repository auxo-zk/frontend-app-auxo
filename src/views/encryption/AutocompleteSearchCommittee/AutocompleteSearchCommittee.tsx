import { ArrowDropDownRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useEncrytionPageData, useEncrytionPageFunction } from '../state';

export default function AutocompleteSearchCommittee() {
    const { listCommittee, selectedCommittee } = useEncrytionPageData();
    const { setEncrytionPageData } = useEncrytionPageFunction();
    // const options = listCommittee.map((option) => {
    //     const firstLetter = option.name[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });

    return (
        <Autocomplete
            value={selectedCommittee}
            onChange={(e, value) => {
                // console.log(value);
                setEncrytionPageData({ selectedCommittee: value ? value : null });
            }}
            options={listCommittee.sort((a, b) => -b.name.localeCompare(a.name))}
            // groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => `ID ${option.idCommittee}: ${option.name}`}
            popupIcon={<ExpandMoreRounded sx={{ color: 'secondary.main' }} />}
            sx={{ width: 300, mt: 2.5 }}
            renderInput={(params) => <TextField type="text" name="auto_complete_search_committe" {...params} label="Search committee" color="secondary" />}
        />
    );
}
