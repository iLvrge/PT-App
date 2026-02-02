import React from 'react';
import useStyles from './styles';
import { numberWithCommas } from '../../utils/numbers';

const BreakdownDisplay = ({ data }) => {
    const classes = useStyles();

    // Mapping from M-codes to friendly labels
    const getLabelForKey = (key) => {
        const labelMap = {
            'M2551': 'M/F1st',
            'M2552': 'M/F2nd',
            'M2553': 'M/F3rd',
            'M2554': 'S/C1st',
            'M2555': 'S/C2nd',
            'M2556': 'S/C3rd',
        };
        return labelMap[key] || key;
    };

    // Parse the data if it's a string
    const parseData = () => {
        if (!data) return {};
        
        try {
            if (typeof data === 'string') {
                return JSON.parse(data);
            }
            return data;
        } catch (error) {
            console.error('Error parsing breakdown data:', error);
            return {};
        }
    };

    const breakdownData = parseData();
    const entries = Object.entries(breakdownData);

    if (entries.length === 0) {
        return null;
    }

    // Define the correct order and sort entries
    const keyOrder = ['M2551', 'M2552', 'M2553', 'M2554', 'M2555', 'M2556'];
    const sortedEntries = entries.sort((a, b) => {
        return keyOrder.indexOf(a[0]) - keyOrder.indexOf(b[0]);
    });

    // Split entries: first 3 for left (M/F), last 3 for right (S/C)
    const leftColumn = sortedEntries.slice(0, 3);  // M2551, M2552, M2553
    const rightColumn = sortedEntries.slice(3, 6); // M2554, M2555, M2556

    return (
        <div className={classes.breakdownContainer}>
            <div className={classes.breakdownTwoColumn}>
                {/* Left Column - First 3 items */}
                <div className={classes.breakdownColumn}>
                    {leftColumn.map(([key, value]) => (
                        <div key={key} className={classes.breakdownItem}>
                            <span className={classes.breakdownKey}>
                                {getLabelForKey(key)}:
                            </span>
                            <span className={classes.breakdownValue}>
                                {numberWithCommas(value)}
                            </span>
                        </div>
                    ))}
                </div>
                
                {/* Right Column - Last 3 items */}
                <div className={classes.breakdownColumn}>
                    {rightColumn.map(([key, value]) => (
                        <div key={key} className={classes.breakdownItem}>
                            <span className={classes.breakdownKey}>
                                {getLabelForKey(key)}:
                            </span>
                            <span className={classes.breakdownValue}>
                                {numberWithCommas(value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreakdownDisplay;
