import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import routes from '../../routeList'

import AssetTimelineWithCommentView from './AssetTimelineWithCommentView'
import AssetTimelineCommentWithTransactionView from './AssetTimelineCommentWithTransactionView'
import AssetTimelineCommentWithIllustrationView from './AssetTimelineCommentWithIllustrationView'
import AssetTransactionIllustrationCommentWithDetail from './AssetTransactionIllustrationCommentWithDetail'
import AssetCommentTransactionWithIllustration from './AssetCommentTransactionWithIllustration'



const Review = () => {

    const authenticated = useSelector(store => store.auth.authenticated)
    if (!authenticated) return <Redirect to={'/'} /> 
    return(   
        <Switch>
                <Route
                key={1}
                exact={true}
                path={routes.review}
                component={AssetTimelineWithCommentView}
                />  
                <Route
                key={2}
                exact={true}
                path={routes.review3}
                component={AssetTimelineCommentWithIllustrationView}
                />  
                <Route
                key={3}
                exact={true}
                path={routes.review2}
                component={AssetTimelineCommentWithTransactionView}
                />
                <Route
                key={4}
                exact={true}
                path={routes.review4}
                component={AssetTransactionIllustrationCommentWithDetail}
                /> 
                <Route
                key={5}
                exact={true}
                path={routes.review5}
                component={AssetCommentTransactionWithIllustration}
                />
            
        </Switch>
    )  
}

export default Review