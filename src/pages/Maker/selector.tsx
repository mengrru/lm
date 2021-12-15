import {useContext, useEffect, useRef, useState} from 'react';
import { ImageOnCanvas, Popup } from '../../common';
import { PathHash, UserOutputData } from '../../data-format-def';
import { genInitUserData, genSingleUserData } from '../../data-trans';
import {GlobalContext} from '../../global'
import './index.css'
import { genOutputCanvas, getAnPic, isInEvilBrowser } from '../../utils';
import {MakerAction, MakerActionContext} from './action';

type ResultPreviewProps = {
  userData: UserOutputData
  width: string
}
function ResultPreview (props: ResultPreviewProps) {
  const preview = Object.keys(props.userData)
    .map(title => {
      const itemData = props.userData[title]
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
            src={(picInfo.miniPath || picInfo.path)}
            alt={itemData.itemTitle}
          />
        </div>
      )
    })
  return (
    <div
      className="preview"
      style={{position: 'relative',  width: props.width, paddingTop: '100%' }}
    >
      {preview}
    </div>
  )
}

type ItemProps = {
  path: string
  size: number
  picId: string
}
function Item (props: ItemProps) {
  const [canvas, setCanvas] = useState(<div></div>)
  const $image = useRef(getAnPic(props.picId, props.path))

  useEffect(() => {
    if ($image.current.complete) {
      updateCanvas()
    } else {
      $image.current.onload = () => {
        updateCanvas()
      }
    }
  }, [$image])

  function updateCanvas () {
    setCanvas(
      <ImageOnCanvas
        imageObjs={[$image.current]}
        canvasSize={[props.size, props.size]}
        border={5}
      />
    )
  }
  return (
    <div style={{width: props.size + 'px', height: props.size + 'px'}}>
      {canvas}
    </div>
  )
}

type ItemsPorps = {
  handleOutput: (selectedItemTitle: string, picId: PathHash) => void
  selectedItem: string // unique title or ''
  itemSize: number
}
function Items (props: ItemsPorps) {
  const Global = useContext(GlobalContext)
  const MakerAct = useContext(MakerActionContext)

  function onItemClick (itemTitle: string, pidId: PathHash) {
    MakerAct.setSelectItem()
    props.handleOutput(itemTitle, pidId)
  }
  const itemSize = props.itemSize
  const ROOT = Global.root
  const curCateData = Global.config!.category[MakerAct.curCategoryName]
  const picsMetadata = Global.metadata.data
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
          onClick={() => onItemClick(item.title, item.pic.picId)}
          className={
            (props.selectedItem === item.title ? 'selected-item' : '')
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
        onClick={() => onItemClick(item.title, item.pic.picId)}
        className={
          (props.selectedItem === item.title ? 'selected-item' : '')
          + ' item'
        }
        key={path}
      >
        <Item
          size={itemSize}
          path={path}
          picId={item.pic.picId}
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

function Category () {
  const Global = useContext(GlobalContext)
  const MakerAct = useContext(MakerActionContext)

  const width = Global.width
  const categoryData = Global.config.category

  const UI = Object.keys(categoryData)
    .sort((a, b) =>
      categoryData[a].info.index - categoryData[b].info.index)
    .map((ctitle) => {
      const info = categoryData[ctitle].info
      if (info.hide) {
        return (
          <div key={ctitle}></div>
        )
      }
      return (
        <MakerActionContext.Consumer key={ctitle}>
        {
          value =>
            <div
              className={
                (value.curCategoryName === ctitle ? 'selected-category': '')
                + ' category-item'
              }
              style={{width: width / 4 + 'px', height: width / 4 / 1.8 + 'px'}}
            >
              {
                info.icon &&
                <img src={info.icon} alt=""/>
              }
              <button onClick={() => MakerAct.setCurCategoryName(ctitle)}>{ctitle}</button>
            </div>
        }
        </MakerActionContext.Consumer>
      )
    })
  return <div className="category">{UI}</div>
}

export default function Selector () {
  const Global = useContext(GlobalContext)
  const MakerAct = useContext(MakerActionContext)

  const [userOutputData, setUserOutputData] = useState(
    genInitUserData(
      Global.root,
      Global.config.category,
      Global.metadata.data
    ) as UserOutputData
  )
  const [outputImageDataURL, setOutputImageDataURL] = useState('')

  useEffect(() => {
    if (MakerAct.action === MakerAction.SelectItem) {
      setOutputImageDataURL('')
    }
  }, [MakerAct.action])

  function handleInputFromItems (itemTitle: string, picId: PathHash) {
    if (itemTitle === '') {
      delete userOutputData[MakerAct.curCategoryName]
      setUserOutputData({ ...userOutputData })
      return
    }
    if (
      userOutputData[MakerAct.curCategoryName]
      && userOutputData[MakerAct.curCategoryName].itemTitle === itemTitle
    ) {
      return
    }
    setUserOutputData({
      ...userOutputData,
      [MakerAct.curCategoryName]: genSingleUserData(
        Global.root!,
        Global.config!.category,
        Global.metadata!.data,
        MakerAct.curCategoryName,
        picId
      )
    })
  }
  function onClickDownload () {
    MakerAct.setDownload()
    const imagep = genOutputCanvas(userOutputData)
    if (isInEvilBrowser()) {
      imagep.then((canvas) => {
        setOutputImageDataURL(canvas.toDataURL())
      })
    } else {
      imagep.then((canvas) => {
        canvas.toBlob(function (blob) {
          saveAs(blob!, 'output.png')
        })
      })
    }
  }

  const width = Global.width
  const u = userOutputData[MakerAct.curCategoryName]

  return (
    <div>
      <MakerActionContext.Consumer>
        {
          value =>
            value.action === MakerAction.Download
            && <Popup content={outputImageDataURL} />
        }
      </MakerActionContext.Consumer>
      <ResultPreview
        width={'100%'}
        userData={userOutputData}
      />
      <Category />
      <Items
        handleOutput={handleInputFromItems}
        selectedItem={u ? u.itemTitle : ''}
        itemSize={width / 3}
      />
      <button className="download-btn" onClick={() => onClickDownload()}>下载</button>
    </div>
  )
}
