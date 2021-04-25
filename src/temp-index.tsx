export default function IndexContent () {
  document.title = '欢迎光临'
  const divCSS: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  }
  const btnCSS: React.CSSProperties = {
    display: 'inline-block',
    border: '1px solid rgb(73,125,63)',
    padding: '5px 5px',
    borderRadius: '7px',
    margin: '5px',
    color: 'rgb(73,125,63)',
    textDecoration: 'none',
    opacity: '.7',
    marginTop: '30px'
  }
  return (
    <div style={divCSS}>
      <a style={btnCSS} href="/linmo">林墨换装游戏</a>
      <a style={btnCSS} href="/linmo/auto">用你的id生成一个林墨</a>
      <a style={btnCSS} href="/create">我也要创建一个换装游戏（测试）</a>
    </div>
  )
}