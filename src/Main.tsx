import React, { RefObject } from 'react';
import { Config, Metadata } from './data-format-def';
import './Main.css'
import './linmo.css'
import Selector from './Selector'

type MainProps = {
    config: Config,
    metadata: Metadata
}
type MainState = {
}
export default class Main extends React.Component<MainProps, MainState> {
    constructor (props: MainProps) {
        super(props)
    }
    componentWillUnmount () {
        // delete Global.config
        // delete Global.metadata
    }
    render () {
        const width = document.body.clientWidth * 0.7 * 0.94
        return (
            <div className="main">
                <div className="container">
                    <header className="header"></header>
                    <div className="body">
                        <Selector
                            width={width > 400 ? 400 * 0.94 : (width < 330 ? 330 * 0.94 : width)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}