import React from 'react';
import { Config, Metadata, UserOutputData } from './data-format-def';
import { genInitUserData, genSingleUserData, getRootName } from './data-trans';
import Global from './global';
import { genOutputImage } from './utils';
import './Auto.css'
import { Md5 } from 'ts-md5/dist/md5'

type AutoProps = {
    config: Config,
    metadata: Metadata
    rootName: string
}
type AutoState = {
    userOutputData: UserOutputData
    outputImageBase64: string
    userInput: string
}
export default class Auto extends React.Component<AutoProps, AutoState>{
    constructor (props: AutoProps) {
        super(props)
        this.state = {
            userOutputData: genInitUserData(
                Global.root!,
                this.props.config.category,
                this.props.metadata.data
            ),
            outputImageBase64: '',
            userInput: ''
        }
    }
    componentDidMount () {
        this.refreshImage()
    }
    componentDidUpdate () {

    }
    onInputChange (v: string) {
        this.setState({
            userInput: v
        })
    }
    onConfirm () {
        this.genUserData()
    }
    genUserData () {
        const cInfo = this.props.config.category
        const cTitles = Object.keys(this.props.config.category).filter(v => !cInfo[v].info.hide).sort((a, b) => a < b ? 1 : -1)
        const cLen = cTitles.length
        const md5str: string = Md5.hashStr(this.state.userInput) as string
        const mLen = md5str.length
        let sLen = Math.floor(mLen / cLen)
        let sMax = parseInt(Array(sLen).fill('F').join(''), 16)
        const newUserOutputData: UserOutputData = genInitUserData(Global.root!, cInfo, this.props.metadata.data)
        for (let i = 0; i < cLen; i++) {
            const num = parseInt(md5str.slice(i * sLen, i * sLen + sLen), 16)
            const cTitle = cTitles[i]
            const items = cInfo[cTitle].items.slice().sort((a, b) => a.title < b.title ? 1 : -1)
            const iLen = items.length
            const iIndex = Math.floor(num / (sMax / iLen))
            newUserOutputData[cTitle] = genSingleUserData(Global.root!, cInfo, this.props.metadata.data, cTitle, items[iIndex].pic.picId)
        }
        this.setState({
            userOutputData: newUserOutputData
        }, () => {
            this.refreshImage()
        })
    }
    refreshImage () {
        this.setState({
            outputImageBase64: ''
        })
        const imagep = genOutputImage(this.state.userOutputData)
        imagep.then((canvas) => {
            canvas.toBlob((blob) => {
                const reader = new FileReader()
                reader.readAsDataURL(blob!)
                reader.onload = (e) => {
                    this.setState({
                        outputImageBase64: e.target?.result as string
                    })
                }
            })
        })
    }
    render () {
        return (
            <div className="auto-container">
                <h2 className="auto-title">{this.props.config.info.title}</h2>
                <div className="auto-image-container">
                    {
                        this.state.outputImageBase64
                        ? (
                            <img src={this.state.outputImageBase64} alt={this.props.config.info.title}/>
                        )
                        : '努力加载中...'
                    }
                </div>
                <div className="auto-input-container">
                    <input className="auto-input" type="text" placeholder="输入你的名字、id或其它" onChange={(e) => this.onInputChange(e.target.value)}/>
                    <br/>
                    <button className="auto-button" onClick={() => this.onConfirm()}>点击获得图片</button>
                </div>
                <div className="auto-link-container">
                    <a href={'/' + this.props.rootName}>去玩换装游戏</a>
                </div>
            </div>
        )
    }
}