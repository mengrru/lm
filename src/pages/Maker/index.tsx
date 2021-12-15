import {useContext} from 'react';
import './index.css'
import Selector from './selector'
import { isInEvilBrowser } from '../../utils';
import {GlobalContext} from '../../global';
import {MakerAction, MakerActionContext, useMakerAction} from './action';
import {Link} from 'react-router-dom';

type MakerProps = {
  rootName: string
}
export default function Maker (props: MakerProps) {
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
        <div className="page-footer">
          <Link className="link" to={props.rootName + '/auto'}>去使用id自动生成</Link>
          <Link className="link" to='create'>我也要制作一个捏脸游戏</Link>
          <a target="_blank" className="link" href={'//' + Global.config.info.author.website}>
            作者：{Global.config.info.author.name || '匿名'}
          </a>
        </div>
      </div>
    </div>
  )
}
