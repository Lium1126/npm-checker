# npm Checker

## Feature

"npm Checker" is an API that determines the safety of npm packages from multiple perspectives before installing them.

### Perspectives

| Viewpoints | Thresholds |
| --- | --- |
| Is it an active package? | Updated within the past year |
| Does it have a track record of being used? | The number of installations is 500 or more |
| Has it passed multiple reviews? | 5 or more contributors |

### Request

<table>
    <tr>
        <td>Endpoint</td>
        <td><code>/check-package/{Package Name}</code></td>
    </tr>
    <tr>
        <td>Method</td>
        <td><code>GET</code></td>
    </tr>
</table>

### Response

**When safety is high**

Status code: `200`
```json
{
   "can_use":true,
   "reason":""
}
```

**If there is no updating within one year**

Status code: `200`
```json
{
   "can_use":false,
   "reason":"That package hasn't been updated in over 1 year"
}
```

**If the number of installations is less than 500**

Status code: `200`
```json
{
   "can_use":false,
   "reason":"The package has fewer than 500 installs in the last month"
}
```

**If there are fewer than 5 contributors**

Status code: `200`
```json
{
   "can_use":false,
   "reason":"This package has few contributors"
}
```

**If the package does not exist**

Status code: `404`
```json
{
   "message":"Package Not Found"
}
```

**When not using GitHub for repository management**

Status code: `500`
```json
{
   "message":"Unsupported Repository Type"
}
```

**Others**

Status code: `500`
```json
{
   "message":"Unexpected Error"
}
```

## Requirement

- Node.js 19.9.0


## Usage

### Server side
```bash
$ npm install
$ npm run start
```

### Dev environment
```bash
$ npm install
$ npm run dev
```

### Build only
```bash
$ npm install
$ npm run build
```

## License

"npm Checker" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
