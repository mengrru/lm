import React, {useContext, useState} from "react"
import {Config} from "../../data-format-def"
import {GlobalContext} from "../../global"

export enum MakerAction {
  SelectItem,
  Download
}
export const MakerActionContext = React.createContext({
  curCategoryName: '',
  action: MakerAction.SelectItem,
  setSelectItem () {},
  setDownload () {},
  setCurCategoryName (data: string) {}
})

export const useMakerAction = (initAction: MakerAction) => {
  const Global = useContext(GlobalContext)
  const [action, setAction] = useState(initAction)
  const [curCategoryName, setCurCategoryName] = useState(
    getDefaultSelectedCategoryName(Global.config)
  )
  return {
    action,
    curCategoryName,
    setSelectItem () {
      setAction(MakerAction.SelectItem)
    },
    setDownload () {
      setAction(MakerAction.Download)
    },
    setCurCategoryName
  }
}


function getDefaultSelectedCategoryName (config: Config): string{
  return Object.keys(config.category)
    .find(
      title => config.category[title].info.index === 1
    )!
}
