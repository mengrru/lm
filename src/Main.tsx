import React, { RefObject } from 'react';
import { Config, Metadata } from './data-format-def';
import './Main.css'
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
        const width = document.body.clientWidth * 0.7
        return (
            <div className="main">
                <div
                    className="container"
                >
                    <Selector
                        width={width > 400 ? 400 : (width < 330 ? 330 : width)}
                    />
                </div>
            </div>
        )
    }
}