import {waitFor} from '@testing-library/dom'
import {render, unmountComponentAtNode} from 'react-dom'
import { act } from 'react-dom/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import { GlobalContext } from '../../../global'

import Maker from '../index'

let container: HTMLElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
})


it("if in Evil browser, pop up result image above preview area.", async () => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: 'weibo'
  })

  const host = 'lm.mengru.space'

  await act(async () => {
    const config = await fetch('http://'+host+'/sources/example/config.json')
      .then(data => data.json())
    const metadata = await fetch('http://'+host+'/sources/example/metadata.json')
      .then(data => data.json())
    render(
      <GlobalContext.Provider value={{
        config: config,
        metadata: metadata,
          root: 'http://'+host+'/sources/example/',
        width: 200,
        setRoot () {},
        setConfig () {},
        setMetadata () {},
        updateClientWidth () {}
      }}>
        <Router>
          <Maker rootName="example" />
        </Router>
      </GlobalContext.Provider>
    , container)
  })

  const $download = document.querySelector('.download-btn')

  act(() => {
    $download!.dispatchEvent(new MouseEvent('click', { bubbles: true}))
  })
  expect($download).not.toBeNull()

  await waitFor(() => {
    const $popup = document.querySelector('.popup')
    expect($popup).not.toBeNull()
  }, { timeout: 3000 })
})
