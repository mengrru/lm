import React from 'react';
import { Config, Metadata, PathHash, PicsMetadata, UserOutputData } from './data-format-def';
import Global from './global'

type ResultPreviewProps = {
    userData: UserOutputData
}
type ResultPreviewState = {
}
class ResultPreview extends React.Component<ResultPreviewProps, ResultPreviewState> {
    constructor (props: ResultPreviewProps) {
        super(props)
    }
    render () {
        const preview = Object.keys(this.props.userData)
            .map(title => {
                const itemData = this.props.userData[title]
                return itemData.pics.map(picInfo => {
                    return (
                        <div
                            style={{position: 'absolute', top: 0, left: 0}}
                        >
                            <img
                                src={picInfo.miniPath || picInfo.path}
                                alt={itemData.itemTitle}
                            />
                        </div>
                    )
                })
            })
        return (
            <div
                style={{position: 'relative'}}
            >
                {preview}
            </div>
        )
    }
}

type ItemsPorps = {
    selectedItem: string // unique title
    selectedCategory: string // unique title
    // handleOutput: (selectedItem)
}
type ItemsState = {
}
class Items extends React.Component<ItemsPorps, ItemsState> {
    constructor (props: ItemsPorps) {
        super(props)
        this.state = {
        }
    }
    render () {
        const ROOT = '/sources/' + Global.config!.root
        const curCateData = Global.config!.category[this.props.selectedCategory]
        const picsMetadata = Global.metadata!.data
        const itemsData = curCateData.items
        const itemsUI = itemsData.map((item) => {
            const pathArr = item.pics.map(picInfo => ROOT + picsMetadata[picInfo.picId])
            return (
                <div>
                    {/* <Canvas paths={pathArr} /> */}
                </div>
            )
        })
        return (
            <div>
                {itemsUI}
            </div>
        )
    }
}

type SelectorProps = {
}
type SelectorState = {
    selectedCategory: string
    userData: UserOutputData
}
class Selector extends React.Component<SelectorProps, SelectorState> {
    constructor (props: SelectorProps) {
        super(props)
        this.state = {
            selectedCategory: Object.keys(Global.config!.category)
                .find(title => Global.config!.category[title].info.index === 1)!,
            userData: {} // need init
        }
    }
    render () {
        const categoryData = Global.config!.category
        const categoryUI = Object.keys(categoryData)
            .sort((a, b) => categoryData[a].info.index - categoryData[b].info.index)
            .map((ctitle) => {
                const info = categoryData[ctitle].info
                return (
                    <div>
                        {
                            info.icon &&
                            <img src={info.icon} alt=""/>
                        }
                        <button>{info.title}</button>
                    </div>
                )
            })
        const selectedCategory = this.state.selectedCategory
        
        return (
            <div>
                <ResultPreview
                    userData={this.state.userData}
                />
                <div>{categoryUI}</div>
                <Items
                    selectedCategory={selectedCategory}
                    selectedItem={this.state.userData[selectedCategory].itemTitle}
                />
            </div>
        )
    }
}

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
        delete Global.config
        delete Global.metadata
    }
    render () {
        return (
            <div>
                <Selector
                />
            </div>
        )
    }
}