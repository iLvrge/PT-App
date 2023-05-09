import React, { useCallback, useEffect, useState } from 'react'
import { Button, ListItemText, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import useStyles from './styles'


const MoveItems = (props) => {
    const classes = useStyles()
    const [groups, setGroups] = useState([])
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)

    useEffect(() => {
        const group = [];
        if (props.list.length > 0) {
            props.list.map(company => {
                if (company.type == 1) {
                    group.push(company)
                }
            })
        }
        setGroups(group)
    }, [])


    const openAddMenu = useCallback((e) => setMenuAnchorEl(e.currentTarget), [])
    const closeAddMenu = useCallback(() => setMenuAnchorEl(null), [])


    const GetChildItems = () => {
        if (groups.length == 0) return null
        return (
            groups.map(company => (
                <MenuItem key={company.id} value={company.id}>
                    <ListItemText className={'heading'}>
                        {
                            company.representative_name === null
                                ? company.original_name
                                : company.representative_name}
                    </ListItemText>
                </MenuItem>
            ))
        )
    }
    return (
        <Box>
            <Button
                disabled={props.companies.length == 0 && props.child.length == 0}
                onClick={openAddMenu}
                className={classes.btnGroup}
                style={{color: '#fff'}}
            >
                Move To
            </Button>
            <Menu
                open={!!menuAnchorEl}
                anchorEl={menuAnchorEl}
                onClose={closeAddMenu}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                {

                    props.child.length > 0
                        ?
                        <MenuItem key={-99} value={-99}>
                            <ListItemText className={'heading'}>
                                Move outside this group
                            </ListItemText>
                        </MenuItem>
                        :
                        ''
                }
                <GetChildItems />
            </Menu>
        </Box>
    )
}


export default MoveItems;