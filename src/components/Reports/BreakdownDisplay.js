import React from 'react';
import useStyles from './styles';
import { numberWithCommas } from '../../utils/numbers';

const BreakdownDisplay = ({ data }) => {
    const classes = useStyles();

    // Mapping from M-codes to friendly labels
    const getLabelForKey = (key) => {
        const labelMap = {
            'M2551': 'M/F1',
            'M2552': 'M/F2',
            'M2553': 'M/F3',
            'M2554': 'S/C1',
            'M2555': 'S/C2',
            'M2556': 'S/C3',
        };
        return labelMap[key] || key;
    };

    // Extract count from value (handles both old number format and new object format)
    const getCount = (value) => {
        if (value !== null && typeof value === 'object') return value.count ?? 0;
        return value ?? 0;
    };

    const getLast10Years = (value) => {
        if (value !== null && typeof value === 'object') return value.last_10_years ?? null;
        return null;
    };

    // Parse the data if it's a string
    const parseData = () => {
        if (!data) return {};
        try {
            if (typeof data === 'string') return JSON.parse(data);
            return data;
        } catch (error) {
            console.error('Error parsing breakdown data:', error);
            return {};
        }
    };

    const breakdownData = parseData();
    const entries = Object.entries(breakdownData);

    if (entries.length === 0) return null;

    // Define the correct order and sort entries
    const keyOrder = ['M2551', 'M2552', 'M2553', 'M2554', 'M2555', 'M2556'];
    const sortedEntries = entries.sort((a, b) => keyOrder.indexOf(a[0]) - keyOrder.indexOf(b[0]));

    // Split entries: first 3 for left (M/F), last 3 for right (S/C)
    const leftColumn = sortedEntries.slice(0, 3);
    const rightColumn = sortedEntries.slice(3, 6);

    const renderItem = ([key, value]) => (
        <div key={key} className={classes.breakdownItem}>
            <span className={classes.breakdownKey}>
                {getLabelForKey(key)}:
            </span>
            <span className={classes.breakdownValueGroup}>
                <span className={classes.breakdownValue}>
                    {numberWithCommas(getCount(value))}
                </span>
                {getLast10Years(value) !== null && (
                    <span className={classes.breakdownSubValue}>
                        {numberWithCommas(getLast10Years(value))}
                    </span>
                )}
            </span>
        </div>
    );

    return (
        <div className={classes.breakdownContainer}>
            <div className={classes.breakdownTwoColumn}>
                <div className={classes.breakdownColumn}>
                    {leftColumn.map(renderItem)}
                </div>
                <div className={classes.breakdownColumn}>
                    {rightColumn.map(renderItem)}
                </div>
            </div>
        </div>
    );
};

export default BreakdownDisplay;
