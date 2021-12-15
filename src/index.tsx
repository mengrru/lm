import React, {useContext, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom"
import { loadFile } from './utils';
import { GlobalContext, useGlobalContext } from './global'
import { Root } from './data-format-def';
import Maker from './pages/Maker';
import Test from './pages/Test';
import Create from './pages/Create'
import Index from './pages/Index'
import Auto from './pages/Auto'
import {ScrollToTopUsedInRouter} from './common';


function TopRoute () {
  const global = useGlobalContext()

  return (
    <GlobalContext.Provider value={global}>
      <Router>
        <ScrollToTopUsedInRouter />
        <Switch>
          <Route path="/create" children={<Create />} />
          <Route path="/test" children={<Test />} />
          <Route path="/:id/:auto" children={<WithRouterUserPage />} />
          <Route path="/:id" children={<WithRouterUserPage />} />
          <Route path="/">
              <Index />
          </Route>
        </Switch>
      </Router>
    </GlobalContext.Provider>
  )
}

const UserPage = (props: any) => {
  const Global = useContext(GlobalContext)

  const pageId = useMemo(
    () => props.match.params.id,
    [props.match]
  )
  const isAuto = useMemo(
    () => props.match.params.auto === 'auto',
    [props.match]
  )
  const [loading, setLoading] = useState(false)
  const [stylePath, setStylePath] = useState('')

  useEffect(() => {
    Global.updateClientWidth()
  })

  useEffect(() => {
    setLoading(true)
    loadFile('/sources/' + pageId + '/root.json')
      .then((data) => {
        const rootData: Root = JSON.parse(data)
        Global.setRoot(rootData.root)
        return rootData.root
      }).then(root => {
        setStylePath(root + pageId + '.css')
        return root
      }).then(root => {
        Promise.all([
          loadFile(root + 'config.json?q=' + Math.random())
            .then(config => Global.setConfig(JSON.parse(config))),
          loadFile(root + 'metadata.json?q=' + Math.random())
            .then(metadata => Global.setMetadata(JSON.parse(metadata)))
        ]).then(_ => {
          setLoading(false)
        }).catch(e => {
          console.error(e)
        })
      })
  }, [pageId])

  if (loading) {
    return <div>loading</div>
  } else {
    try {
      document.title = Global.config ? Global.config.info.title : ''
      return (
        <div>
          <link rel="stylesheet" type="text/css" href={stylePath} />
          { isAuto ? <Auto rootName={pageId} /> : <Maker rootName={pageId} /> }
        </div>
      )
    } catch {
      return <div>{'出错啦QAQ'}</div>
    }
  }
}

const WithRouterUserPage = withRouter(UserPage)

ReactDOM.render(
  <React.StrictMode>
    <TopRoute />
  </React.StrictMode>,
  document.getElementById('root')
);
