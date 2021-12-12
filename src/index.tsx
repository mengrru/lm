import React, {useContext, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom"
import './index.css';
import Main from './Main';
import Test from './Test';
import { loadCSS, loadFile } from './utils';
import { GlobalContext, useGlobalContext } from './global'
import { Root } from './data-format-def';
import Create from './Create'
import IndexContent from './temp-index'
import Auto from './Auto'


function Index () {
  const global = useGlobalContext()

  return (
    <GlobalContext.Provider value={global}>
      <Router>
        <div>
          <Switch>
            <Route path="/:id/:auto" children={<WithRouterPage />} />
            <Route path="/:id" children={<WithRouterPage />} />
            <Route path="/">
                <IndexContent />
            </Route>
          </Switch>
        </div>
      </Router>
    </GlobalContext.Provider>
  )
}

const Page = (props: any) => {
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

  useEffect(() => {
    if (
      pageId === 'create'
      || pageId === 'test'
      || loading
      || Global.root
    ) {
      return
    }
    setLoading(true)
    loadFile('/sources/' + pageId + '/root.json')
      .then((data) => {
        const rootData: Root = JSON.parse(data)
        Global.setRoot(rootData.root)
        return rootData.root
      }).then(root => {
        loadCSS(root + pageId + '.css')
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
  })
  switch (pageId) {
    case 'create':
      return <Create />
    case 'test':
      return <Test />
    default:
      if (loading) {
        return <div>loading</div>
      } else {
        try {
          document.title = Global.config ? Global.config.info.title : ''
          if (isAuto) {
            return (
              <Auto
                rootName={pageId}
              />
            )
          } else {
            return (
              <Main
                config={Global.config}
                metadata={Global.metadata}
              />
            )
          }
        } catch {
          return <div>{'出错啦QAQ'}</div>
        }
      }
  }
}

const WithRouterPage = withRouter(Page)

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);
