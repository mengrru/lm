import React from 'react';
import { ImageOnCanvas } from './common';
import { Config, Metadata, PathHash, UserOutputData } from './data-format-def';
import Global from './global'
import './Main.css'

type ResultPreviewProps = {
    userData: UserOutputData
    width: number
}
type ResultPreviewState = {
}
class ResultPreview extends React.Component<ResultPreviewProps, ResultPreviewState> {
    constructor (props: ResultPreviewProps) {
        super(props)
    }
    render () {
        const ROOT = '/sources/' + Global.config!.root
        const preview = Object.keys(this.props.userData)
            .map(title => {
                const itemData = this.props.userData[title]
                const picInfo = itemData.pic
                return (
                    <div
                        style={{position: 'absolute', top: 0, left: 0, zIndex: itemData.pic.index}}
                        key={itemData.pic.picId}
                    >
                        <img
                            width="100%"
                            height="100%"
                            src={ROOT + (picInfo.miniPath || picInfo.path)}
                            alt={itemData.itemTitle}
                        />
                    </div>
                )
            })
        return (
            <div
                style={{position: 'relative', left: 100, width: this.props.width + 'px'}}
            >
                {preview}
            </div>
        )
    }
}

type ItemProps = {
    path: string
}
type ItemState = {
    canvas: JSX.Element
}
class Item extends React.Component<ItemProps, ItemState> {
    imageObj: HTMLImageElement
    constructor (props: ItemProps) {
        super(props)
        this.imageObj = new Image()
        this.state = {
            canvas: (<div></div>)
        }
    }
    componentDidMount () {
        this.imageObj.src = this.props.path
        this.imageObj.onload = () => {
            this.setState({
                canvas: (
                    <ImageOnCanvas
                        imageObjs={[this.imageObj]}
                        canvasSize={[90, 90]}
                        border={5}
                    />
                )
            })
        }
    }
    render () {
        return (
            <div>
                {this.state.canvas}
            </div>
        )
    }
}

type ItemsPorps = {
    selectedItem: string // unique title or ''
    selectedCategory: string // unique title
    handleOutput: (selectedItemTitle: string, picId: PathHash) => void
}
type ItemsState = {
}
class Items extends React.Component<ItemsPorps, ItemsState> {
    constructor (props: ItemsPorps) {
        super(props)
        this.state = {
        }
    }
    onItemClicked (itemTitle: string, pidId: PathHash) {
        this.props.handleOutput(itemTitle, pidId)
    }
    render () {
        const ROOT = '/sources/' + Global.config!.root
        const curCateData = Global.config!.category[this.props.selectedCategory]
        const picsMetadata = Global.metadata!.data
        const itemsData = curCateData.items
        const itemsUI = itemsData.map((item) => {
            // /sources/FullPath
            const m = picsMetadata[item.pic.picId]
            const path = ROOT + (m.miniPath || m.path)
            return (
                <div
                    onClick={() => this.onItemClicked(item.title, item.pic.picId)}
                    className={this.props.selectedItem === item.title ? 'selected-item' : ''}
                    key={path}
                >
                    <Item
                        path={path}
                    />
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
    categoryData: Config['category']
    constructor (props: SelectorProps) {
        super(props)
        this.categoryData = Global.config!.category
        this.state = {
            selectedCategory: this.getInitSelectedCategory(),
            userData: this.genInitUserData()
        }
        this.getSelectedItem = this.getSelectedItem.bind(this)
    }
    getInitSelectedCategory (): string{
        return Object.keys(Global.config!.category)
            .find(title => Global.config!.category[title].info.index === 1)!
    }
    genInitUserData (): UserOutputData {
        const res: UserOutputData = {}
        Object.keys(this.categoryData)
            .forEach(categoryTitle => {
                const cData = this.categoryData[categoryTitle]
                if (!cData.info.defaultPic) {
                    return
                }
                const defaultId = cData.info.defaultPic
                res[categoryTitle] = this.genSingleUserData(categoryTitle, defaultId)
            })
        return res
    }
    genSingleUserData (categoryTitle: string, picId: PathHash): UserOutputData[any] {
        const cData = this.categoryData[categoryTitle]
        const m = Global.metadata!.data
        const picInfo = cData.items.find(e => e.pic.picId === picId)
        const d = m[picId]
        return {
            itemId: cData.items.findIndex(e => e.pic.picId === picId),
            itemTitle: picInfo!.title,
            pic: {
                    picId: picId,
                    path: d.path,
                    miniPath: d.miniPath || d.path,
                    position: picInfo!.pic.defaultPosition,
                    size: [100, 100],
                    index: cData.info.index
            }
        }
    }
    handleCategoryClick (title: string) {
        this.setState({
            selectedCategory: title
        })
    }
    getSelectedItem (itemTitle: string, picId: PathHash) {
        console.log(itemTitle, 'from Selector')
        const c = this.state.selectedCategory
        if (this.state.userData[c] && this.state.userData[c].itemTitle === itemTitle) {
            return
        }
        this.setState({
            userData: {
                ...this.state.userData,
                [c]: this.genSingleUserData(c, picId)
            }
        })
    }
    render () {
        const categoryData = this.categoryData
        const categoryUI = Object.keys(categoryData)
            .sort((a, b) => categoryData[a].info.index - categoryData[b].info.index)
            .map((ctitle) => {
                const info = categoryData[ctitle].info
                return (
                    <div key={ctitle}>
                        {
                            info.icon &&
                            <img src={info.icon} alt=""/>
                        }
                        <button onClick={() => this.handleCategoryClick(ctitle)}>{ctitle}</button>
                    </div>
                )
            })
        const selectedCategory = this.state.selectedCategory
        const u = this.state.userData[selectedCategory]
        
        return (
            <div>
                <ResultPreview
                    width={100}
                    userData={this.state.userData}
                />
                <div>{categoryUI}</div>
                <Items
                    handleOutput={this.getSelectedItem}
                    selectedCategory={selectedCategory}
                    selectedItem={u ? u.itemTitle : ''}
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