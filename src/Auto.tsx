import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { Config, Metadata, UserOutputData } from './data-format-def';
import { genInitUserData, genSingleUserData } from './data-trans';
import { GlobalContext, useGlobalContext } from './global'
import { genOutputImage } from './utils';
import './Auto.css'
import { Md5 } from 'ts-md5/dist/md5'

type AutoProps = {
  rootName: string
}

export default function Auto (props: AutoProps) {
  const Global = useContext(GlobalContext)
  const [userInputStr, setUserInputStr] = useState('')
  const [loading, setLoading] = useState(true)
  const userOutputData = useMemo(
    () => userInputStr
      ? genRandomUserOuputData(
        Global.root,
        Global.metadata,
        Global.config.category,
        userInputStr
      )
      : genInitUserData(
        Global.root,
        Global.config.category,
        Global.metadata.data
      ),
      [userInputStr])
  const $img: React.MutableRefObject<HTMLImageElement | null> = useRef(null)
  const $input: React.MutableRefObject<HTMLInputElement | null> = useRef(null)

  useEffect(() => {
    if (!loading) {
      return
    }
    const imagep = genOutputImage(userOutputData)
    imagep.then(canvas => {
      if ($img.current) {
        $img.current.src = canvas.toDataURL()
        setLoading(false)
      }
    })
  })

  const onConfirm = () => {
    setLoading(true)
    setUserInputStr(
      $input.current
      ? $input.current.value
      : '')
  }
  return (
    <div className="auto-container">
      <h2 className="auto-title">{Global.config.info.title}</h2>
      <div className="auto-image-container">
        <span style={loading ? { display: 'inline'} : { display: 'none' }}>努力加载中...</span>
        <img style={loading ? { display: 'none'}: { display: 'inline' }} ref={$img} alt={Global.config.info.title}/>
      </div>
      <div className="auto-input-container">
        <input ref={$input} className="auto-input" type="text" placeholder="输入你的名字、id或其它" />
        <br/>
        <button className="auto-button" onClick={() => onConfirm()}>点击获得图片</button>
      </div>
      <div className="auto-link-container">
        <a href={'/' + props.rootName}>去玩换装游戏</a>
      </div>
    </div>
  )
}

function genRandomUserOuputData (
  root: string,
  metadata: Metadata,
  configCategory: Config['category'],
  userInputStr: string
): UserOutputData {
  const cTitles = Object.keys(configCategory).filter(v => !configCategory[v].info.hide).sort((a, b) => a < b ? 1 : -1)
  const cLen = cTitles.length
  const md5str: string = Md5.hashStr(userInputStr) as string
  const mLen = md5str.length
  let sLen = Math.floor(mLen / cLen)
  let sMax = parseInt(Array(sLen).fill('F').join(''), 16)
  const newUserOutputData: UserOutputData = genInitUserData(root, configCategory, metadata.data)
  for (let i = 0; i < cLen; i++) {
    let num = parseInt(md5str.slice(i * sLen, i * sLen + sLen), 16)
    if (num === sMax) {
      num--
    }
    const cTitle = cTitles[i]
    const items = configCategory[cTitle].items.slice().sort((a, b) => a.title < b.title ? 1 : -1)
    const iLen = items.length
    const iIndex = Math.floor(num / (sMax / iLen))
    newUserOutputData[cTitle] = genSingleUserData(root, configCategory, metadata.data, cTitle, items[iIndex].pic.picId)
  }
  return newUserOutputData
}
