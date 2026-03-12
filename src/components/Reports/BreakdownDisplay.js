import React from 'react';
import clsx from 'clsx';
import useStyles from './styles';
import { numberWithCommas } from '../../utils/numbers';

const BreakdownDisplay = ({ data, isKpi }) => {
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
            'patent': 'Patent',
            'application': 'Application'
        };
        return labelMap[key] || (key.charAt(0).toUpperCase() + key.slice(1));
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
            let parsed = typeof data === 'string' ? JSON.parse(data) : data;
            if (parsed && parsed.ccounter) {
                return parsed.ccounter;
            }
            return parsed;
        } catch (error) {
            console.error('Error parsing breakdown data:', error);
            return {};
        }
    };

    const breakdownData = parseData();
    const entries = Object.entries(breakdownData);

    if (entries.length === 0) return null;

    // Define the correct order and sort entries
    const keyOrder = ['M2551', 'M2552', 'M2553', 'M2554', 'M2555', 'M2556', 'patent', 'application'];
    const sortedEntries = entries.sort((a, b) => {
        const indexA = keyOrder.indexOf(a[0]);
        const indexB = keyOrder.indexOf(b[0]);
        if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    // Split entries: first half for left, second half for right
    const midPoint = Math.ceil(sortedEntries.length / 2);
    const leftColumn = sortedEntries.slice(0, midPoint);
    const rightColumn = sortedEntries.slice(midPoint);

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
        <div className={clsx(classes.breakdownContainer, isKpi && classes.breakdownContainerKpi)}>
            <div className={clsx(classes.breakdownTwoColumn, isKpi && classes.breakdownTwoColumnKpi)}>
                <div className={clsx(classes.breakdownColumn, isKpi && classes.breakdownColumnKpi)}>
                    {leftColumn.map(renderItem)}
                </div>
                <div className={clsx(classes.breakdownColumn, isKpi && classes.breakdownColumnKpi)}>
                    {rightColumn.map(renderItem)}
                </div>
            </div>
        </div>
    );
};

export default BreakdownDisplay;
