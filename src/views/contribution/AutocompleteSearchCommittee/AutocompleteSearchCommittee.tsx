import { ArrowDropDownRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useContributionPageData, useContributionPageFunction } from '../state';

export default function AutocompleteSearchCommittee() {
    const { listCommittee } = useContributionPageData();
    const { setContributionPageData } = useContributionPageFunction();
    const options = listCommittee.map((option) => {
        const firstLetter = option.name[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });

    return (
        <Autocomplete
            // value={value}
            onChange={(e, value) => {
                console.log(value);
                setContributionPageData({ selectedCommittee: value ? value.id : null });
            }}
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            popupIcon={<ExpandMoreRounded sx={{ color: 'primary.light' }} />}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField type="text" name="auto_complete_search_committe" {...params} label="Search committee" />}
        />
    );
}
