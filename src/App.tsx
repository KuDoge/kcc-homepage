import React, { lazy, Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'

import Home from './pages/home/'

import './App.less'

const Grants = lazy(() => import(/* webpackChunkName:'grant-page' */ './pages/grants/index'))

export default function App() {
  return (
    <Suspense fallback={'loading'}>
      <HashRouter>
        <AppLayout>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/community/grants" exact={true} component={Grants} />
          </Switch>
        </AppLayout>
      </HashRouter>
    </Suspense>
  )
}
