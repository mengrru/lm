import {useContext} from 'react';
import './index.css'
import Selector from './selector'
import { isInEvilBrowser } from '../../utils';
import {GlobalContext} from '../../global';
import {MakerAction, MakerActionContext, useMakerAction} from './action';

export default function Maker () {
  const Global = useContext(GlobalContext)
  return (
    <div className="main">
      <div className="container">
        <header className="header"></header>
        <div className="body">
          <MakerActionContext.Provider value={useMakerAction(MakerAction.SelectItem)}>
            <Selector />
          </MakerActionContext.Provider>
          {
            isInEvilBrowser()
            ? <p className="warning">温馨提示：你当前在APP内置浏览器中，若想保存图片请点击下载按钮后长按上方预览区保存</p>
            : <p className="warning">{Global.config.info.interface.footerText}</p>
          }
        </div>
      </div>
    </div>
  )
}
