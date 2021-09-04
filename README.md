# lm 捏脸小工具

## 部署

确保已经安装 `node.js` 和 `npm`。

进入项目根目录执行：

```
npm install
```

### 临时部署

执行：

```
npm run start
```

然后访问 `localhost:3006`

### 静态部署

执行：

```
npm run build
```

生成 `build/` 目录后，对其进行静态部署。

## 使用

根据 `/create` 页面的提示创建资源包，然后将其放置在 `public/sources` 目录下（临时部署）或 `build/sources`目录下（静态部署）。

完毕后，访问 `/<资源包名称>` 即可使用该捏脸游戏。

### 根据字符串生成捏脸结果

访问 `/<资源包名称>/auto` 获得功能。

### 自定义样式

在资源包根目录中添加与资源包同名的 css 文件。

比如：对于名为 `example` 的资源包，只需要在其根目录下的 `example.css` 中编写样式，便会自动应用。此示例可以在 `public/sources/example` 中进行查看。

### 修改资源包

如果你想在已经制作好的资源包中添加新的素材，则需要在素材加入后重新在 `/create` 页面制作资源包。暂时无法继承旧的 `config.json` 和 `metadata.json`，这个功能会在未来加入。

## 开发

在项目根目录执行：

```
npm run start
```

### 临时主页

临时主页 `src/temp-index.tsx` 。修改它以自定义属于自己的主页。

Coming soon.
