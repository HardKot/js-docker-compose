const { spawn } = require('node:child_process');
const path = require("node:path");
const fs = require("node:fs");
const { NodeJSDockerCompose } = require("./NodeJSDockerCompose")

function main(options = { }) {
    const {
        filePath = path.join(process.cwd(), 'compose.yaml'),
        logger = console,
    } = options;

    if (!fs.existsSync(filePath)) return logger.error(`${filePath} not found.`);
    const dockerCompose = spawn("docker", ["compose", "-f", filePath, "up", "--abort-on-container-failure", "--build", "-w"]);

    dockerCompose.on("error", (err) => {
        logger.error("Docker compose:\n", err);
    })

    let endPage = ""

    dockerCompose.stdout.on("data", (data) => {
        const text= endPage + data.toString();

        const rows = text.toString().split("\n");

        endPage = rows.pop()

        rows.forEach(row => logger.info(`${row}`));
    })

    dockerCompose.on("close", () => {
        process.exit(1);
    })

    const onExit = () => {
            spawn("docker", ["compose", "-f", filePath, "stop"])
    }

    process.on('SIGINT', onExit);  // CTRL+C
    process.on('SIGQUIT', onExit); // Keyboard quit
    process.on('SIGTERM', onExit); // `kill` command
    process.on('exit', onExit);
}


module.exports = {
    NodeJSDockerCompose,
    DockerCompose: main
};