import React from 'react';
import { Config, Metadata } from './data-format-def';
import './Main.css'
import './linmo.css'
import Selector from './Selector'
import { isInEvilBrowser } from './utils';

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
                        {
                            isInEvilBrowser()
                            ? <p className="warning">温馨提示：你当前在APP内置浏览器中，若想保存图片请点击下载按钮后长按上方预览区保存</p>
                            : <p className="warning">{this.props.config.info.interface.footerText}</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}