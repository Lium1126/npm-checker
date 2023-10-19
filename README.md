# npm Checker

## 仕様

npm Checkerは、npmパッケージをインストールする前に、複数の観点からその安全性を判断するAPIです。

### 判断材料

| 観点 | 閾値 |
| --- | --- |
| アクティブなパッケージであるか | 直近1年以内に更新がある |
| 使用実績があるか | インストール数が500以上である |
| 複数人のレビューを通過しているか | コントリビュータが5人以上である |

### リクエスト

<table>
    <tr>
        <td>エンドポイント</td>
        <td><code>/check-package/{Package Name}</code></td>
    </tr>
    <tr>
        <td>メソッド</td>
        <td><code>GET</code></td>
    </tr>
</table>

### レスポンス

**安全性が高い場合**

ステータスコード：`200`
```json
{
   "can_use":true,
   "reason":""
}
```

**1年以上更新がない**

ステータスコード：`200`
```json
{
   "can_use":false,
   "reason":"That package hasn't been updated in over 1 year"
}
```

**インストール数が500に満たない**

ステータスコード：`200`
```json
{
   "can_use":false,
   "reason":"The package has fewer than 500 installs in the last month"
}
```

**コントリビュータが5人に満たない**

ステータスコード：`200`
```json
{
   "can_use":false,
   "reason":"This package has few contributors"
}
```

**パッケージが存在しない**

ステータスコード：`404`
```json
{
   "message":"Package Not Found"
}
```

**リポジトリがGitHubで管理されていない**

ステータスコード：`500`
```json
{
   "message":"Unsupported Repository Type"
}
```

**その他**

ステータスコード：`500`
```json
{
   "message":"Unexpected Error"
}
```

## 要件

- Node.js 19.9.0


## 使用法

### サーバイドの実行

```bash
$ npm install
$ npm run start
```

### 開発環境での実行

```bash
$ npm install
$ npm run dev
```

### ビルドのみ実行

```bash
$ npm install
$ npm run build
```

## ライセンス

npm Checkerは、[MITライセンス](https://en.wikipedia.org/wiki/MIT_License)の下で提供されています。
