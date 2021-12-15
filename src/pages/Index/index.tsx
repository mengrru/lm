import './index.css'
import {Link} from "react-router-dom"

export default function IndexContent () {
  document.title = '欢迎光临'
  const alternative = [
    ['Example', 'example'],
    ['捏一个林墨', 'linmo']
  ]
  const gameLinksUI = alternative.map(
    e =>
      <Link key={e[1]} className="index-btn" to={`/${e[1]}`}>{e[0]}</Link>
  )
  return (
    <div className="index-container">
      <div>
        目前本实例可以游玩的捏脸游戏：<br/>
        {gameLinksUI}
      </div>
      <Link className="index-link" to="/create">我也要创建一个捏脸游戏</Link>
    </div>
  )
}
