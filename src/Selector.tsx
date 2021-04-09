import React from 'react';
import { ImageOnCanvas } from './common';
import { Config, PathHash, UserOutputData } from './data-format-def';
import Global from './global'
import './Main.css'
import { genOutputImage } from './utils';

type ResultPreviewProps = {
    userData: UserOutputData
    width: string
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
                const picInfo = itemData.pic
                return (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: itemData.pic.index}}
                        key={itemData.pic.picId}
                    >
                        <img
                            width="100%"
                            height="100%"
                            src={picInfo.miniPath || picInfo.path}
                            alt={itemData.itemTitle}
                        />
                    </div>
                )
            })
        return (
            <div
                className="preview"
                style={{position: 'relative',  width: this.props.width, paddingTop: '100%' }}
            >
                {preview}
            </div>
        )
    }
}

type ItemProps = {
    path: string
    size: number
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
                        canvasSize={[this.props.size, this.props.size]}
                        border={5}
                    />
                )
            })
        }
    }
    render () {
        return (
            <div style={{width: this.props.size + 'px', height: this.props.size + 'px'}}>
                {this.state.canvas}
            </div>
        )
    }
}

type ItemsPorps = {
    selectedItem: string // unique title or ''
    selectedCategory: string // unique title
    handleOutput: (selectedItemTitle: string, picId: PathHash) => void
    itemSize: number
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
        const itemSize = this.props.itemSize
        const ROOT = Global.config!.root
        const curCateData = Global.config!.category[this.props.selectedCategory]
        const picsMetadata = Global.metadata!.data
        const itemsData = curCateData.items.slice()
        if (curCateData.info.allowBlank) {
            itemsData.unshift({
                title: '',
                pic: {
                    picId: '',
                    defaultPosition: [0, 0]
                }
            })
        }
        const itemsUI = itemsData.map((item) => {
            // /sources/FullPath
            if (!item.pic.picId) {
                return (
                    <div
                        onClick={() => this.onItemClicked(item.title, item.pic.picId)}
                        className={
                            (this.props.selectedItem === item.title ? 'selected-item' : '')
                            + ' item'
                        }
                        key={''}
                        style={{width: itemSize + 'px', height: itemSize + 'px'}}
                    >
                    </div>
                )
            }
            const m = picsMetadata[item.pic.picId]
            const path = ROOT + (m.miniPath || m.path)
            return (
                <div
                    onClick={() => this.onItemClicked(item.title, item.pic.picId)}
                    className={
                        (this.props.selectedItem === item.title ? 'selected-item' : '')
                        + ' item'
                    }
                    key={path}
                >
                    <Item
                        size={itemSize}
                        path={path}
                    />
                </div>
            )
        })
        return (
            <div className="items">
                {itemsUI}
            </div>
        )
    }
}

type SelectorProps = {
    width: number
}
type SelectorState = {
    selectedCategory: string
    userData: UserOutputData
}
export default class Selector extends React.Component<SelectorProps, SelectorState> {
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
        const ROOT = Global.config!.root
        const cData = this.categoryData[categoryTitle]
        const m = Global.metadata!.data
        const picInfo = cData.items.find(e => e.pic.picId === picId)
        const d = m[picId]
        return {
            itemId: cData.items.findIndex(e => e.pic.picId === picId),
            itemTitle: picInfo!.title,
            pic: {
                    picId: picId,
                    path: ROOT + d.path,
                    miniPath: ROOT + (d.miniPath || d.path),
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
        console.log(itemTitle)
        const c = this.state.selectedCategory
        if (itemTitle === '') {
            delete this.state.userData[c]
            this.setState({
                userData: {
                    ...this.state.userData,
                }
            })
            return
        }
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
    downloadOutputImage () {
        genOutputImage(this.state.userData).then((canvas) => {
            canvas.toBlob(function (blob) {
                saveAs(blob!, 'output.png')
            })
        })
    }
    render () {
        const width = this.props.width
        const categoryData = this.categoryData
        const categoryUI = Object.keys(categoryData)
            .sort((a, b) => categoryData[a].info.index - categoryData[b].info.index)
            .map((ctitle) => {
                const info = categoryData[ctitle].info
                if (info.hide) {
                    return (
                        <div key={ctitle}></div>
                    )
                }
                return (
                    <div
                        key={ctitle}
                        className={
                            (this.state.selectedCategory === ctitle ? 'selected-category': '')
                            + ' category-item'
                        }
                        style={{width: width / 4 + 'px', height: width / 4 / 1.8 + 'px'}}
                    >
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
                    width={'100%'}
                    userData={this.state.userData}
                />
                <div className="category">
                    {categoryUI}
                </div>
                <Items
                    handleOutput={this.getSelectedItem}
                    selectedCategory={selectedCategory}
                    selectedItem={u ? u.itemTitle : ''}
                    itemSize={width / 3}
                />
                <button className="download-btn" onClick={() => this.downloadOutputImage()}>下载</button>
            </div>
        )
    }
}