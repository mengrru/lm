import React from 'react';
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
import Global from './global'
import { Root } from './data-format-def';
import Create from './Create'
import IndexContent from './temp-index'
import Auto from './Auto'

function Index () {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:id/:auto" children={<WithRouterPage />} />
          <Route path="/:id" children={<WithRouterPage />} />
          <Route path="/">
          {/*
            <Create />
          */}
            <IndexContent />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

// :id change -> state.pageId change -> exec render() function ->
// render child page to 'loading' -> exec componentDidMount -> use id fetch config ->
// change Page state -> rerender child page to real page or 404

class Page extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      config: null,
      metadata: null,
      pageId: null,
      customedCSS: null
    }
  }
  static getDerivedStateFromProps(props: any, state: any) {
    if (props.match.params.id !== state.pageId) {
      return {
        pageId: props.match.params.id,
        isAuto: props.match.params.auto === 'auto'
      }
    }
    return null
  }
  componentDidMount () {
    switch (this.state.pageId) {
      case 'create':
      case 'test':
        return
    }
    loadFile('/sources/' + this.state.pageId + '/root.json')
      .then((data) => {
        const rootData: Root = JSON.parse(data)
        Global.root = rootData.root
        const root = Global.root

        try {
          loadCSS(root + this.state.pageId + '.css')
        } catch (_) { }

        loadFile(root + 'config.json?q=' + Math.random())
          .then((config) => {
            this.setState({
              config: config
            })
          }).catch((err) => {
            throw Error(err)
          })
        loadFile(root + 'metadata.json?q=' + Math.random())
          .then((metadata) => {
            this.setState({
              metadata: metadata
            })
          }).catch((err) => {
            throw Error(err)
          })
      })
    }
  // think memory
  render () {
    const id = this.state.pageId
    const isAuto = this.state.isAuto
    switch (id) {
      case 'create':
        return (
          <Create />
        )
      case 'test':
        return (
          <Test />
        )
      default:
        if (!this.state.config || !this.state.metadata) {
          return <div>loading</div>
        } else {
          try {
            const config = JSON.parse(this.state.config)
            const metadata = JSON.parse(this.state.metadata)
            Global.config = config
            Global.metadata = metadata
            document.title = config.info.title
            if (isAuto) {
              return (
                <Auto
                  config={config}
                  metadata={metadata}
                  rootName={id}
                />
              )
            } else {
              return (
                <Main
                  config={config}
                  metadata={metadata}
                />
              )
            }
          } catch {
            return (
              <div>{'出错啦QAQ'}</div>
            )
          }
        }
    }
  }
}

const WithRouterPage = withRouter(Page)

ReactDOM.render(
  <React.StrictMode>
    {Index()}
  </React.StrictMode>,
  document.getElementById('root')
);