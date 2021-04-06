import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import './index.css';
import Test from './Test';

ReactDOM.render(
  <React.StrictMode>
    {Index()}
  </React.StrictMode>,
  document.getElementById('root')
);

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
          <Route path="/:id" children={<Child />} />
        </Switch>
      </div>
    </Router>
  )
}

function Child () {
  // don't know why there has a type error
  // @ts-ignore
  let { id } = useParams()
  return (
    <div>
      <h1>ID: {id}</h1>
    </div>
  )
}