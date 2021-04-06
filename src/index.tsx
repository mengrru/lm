import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom"
import './index.css';
import Main from './Main';
// import Main from './Main';
import Test from './Test';
import { loadFile } from './utils';

function Index () {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/:id" children={<WithRouterPage />} />
        </Switch>
      </div>
    </Router>
  )
}

// :id change -> render Page -> exec render() function ->
// get :id val -> render child page -> use id fetch config ->
// change Page state -> rerender child page

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
    loadFile('/sources/'+ this.state.pageId + '/config.json')
      .then((config) => {
        this.setState({
          config: config
        })
      }).catch((err) => {
        throw Error(err)
      })
    loadFile('/sources/' + this.state.pageId + '/metadata.json')
      .then((metadata) => {
        this.setState({
          metadata: metadata
        })
      }).catch((err) => {
        throw Error(err)
      })
    }
  // think memory
  render () {
    const id = this.state.pageId
    console.log('Page repeat check')
    switch (id) {
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
            const metadata = JSON.parse(this.state.config)
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

function asyncTest (): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })
}

ReactDOM.render(
  <React.StrictMode>
    {Index()}
  </React.StrictMode>,
  document.getElementById('root')
);