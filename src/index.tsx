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
// import Main from './Main';
import Test from './Test';
import { loadFile } from './utils';
import Global from './global'
import { Root } from './data-format-def';

function Index () {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:id" children={<WithRouterPage />} />
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
      pageId: ''
    }
  }
  static getDerivedStateFromProps(props: any, state: any) {
    if (props.match.params.id !== state.pageId) {
      return {
        pageId: props.match.params.id
      }
    }
    return null
  }
  componentDidMount () {
    switch (this.state.pageId) {
      case 'test':
        return
    }
    loadFile('/sources/' + this.state.pageId + '/root.json')
      .then((data) => {
        const rootData: Root = JSON.parse(data)
        Global.root = rootData.root
        const root = Global.root

        loadFile(root + 'config.json')
          .then((config) => {
            this.setState({
              config: config
            })
          }).catch((err) => {
            throw Error(err)
          })
        loadFile(root + 'metadata.json')
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
    console.log('Page repeat check')
    switch (id) {
      case 'test':
        document.title = '拉聂耳地区'
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
            return (
              <Main
                config={config}
                metadata={metadata}
              />
            )
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