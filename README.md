# Node.js Docker Compose 

## Описание

Запускает Docker Compose проекта. Вдохновленно
Spring Docker Compose.

Все манипуляции происходят через Docker Compose Cli;


## Установка

```bash
npm i -d https://github.com/HardKot/js-docker-compose.git

```


## Использование

```javascript
const { 
    NodeJsDockerCompose,
    DockerCompose
} = require("HardKot/js-docker-compose")


DockerCompose() 
// ---- ИЛИ -------
new NodeJsDockerCompose()
    .then(() => console.log("run server"))
    .autoStart()
```