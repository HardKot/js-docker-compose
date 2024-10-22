const path  = require("node:path");
const fs  = require("node:fs");
const {execSync, spawn}  = require("node:child_process");
const { ContainerStatus } = require("./ContainerStatus");

class NodeJSDockerCompose {
    #enable = false;
    #autoStop = true;

    #logger = console
    #dockerComposeFile = path.join(process.cwd(), 'compose.yaml')

    #dockerComposeUp = undefined;
    #dockerComposeStop = undefined;

    #promiseResolve = () => {};
    #promiseReject = () => {};
    #promise = new Promise((resolve, reject) => {
        this.#promiseResolve = resolve;
        this.#promiseReject = reject;
    })

    constructor({ file, logger } = {}) {
        if (!!file) this.#dockerComposeFile = file;
        if (!!logger) this.#logger = logger;
        this.#enable = fs.existsSync(this.#dockerComposeFile);

        if (!this.#enable) this.#logger.error(`${this.#dockerComposeFile} not found!`)
    }

    autoStart() {
        if (!this.#enable) return this;

        const projectIsActive = this.ls()
            .reduce((acc, container) => acc || container.status.startsWith("running"), false)

        if (projectIsActive) {
            this.#logger.info(`${this.#dockerComposeFile} running!`)
            this.#autoStop = false;
            this.logs().#promiseResolve();
            return this;
        }

        this
            .up()
            .logs()

        process.on('SIGINT', () => this.stop());
        process.on('SIGQUIT', () => this.stop());
        process.on('SIGTERM', () => this.stop());
        process.on('exit', () => this.stop());

        return this
    }

    ls() {
        if (!this.#enable) return this;
        const containerStatus = execSync(`docker compose -f ${this.#dockerComposeFile} ls`, { encoding: 'utf8' });
        return containerStatus
            .split(/\r?\n/)
            .slice(0, -1)
            .map(row => new ContainerStatus(
                ...row.replace(/\s*/g, " ").split(" ")
            ));
    }

    up() {
        if (!this.#enable && !!this.#dockerComposeUp) return this;

        this.#dockerComposeUp = spawn("docker", ["compose", "-f", this.#dockerComposeFile, "up", "--build", "-d"]);
        this.#dockerComposeUp.stdout.on("data", this.#loggerSender())

        this.#dockerComposeUp.on("error", (err) => {
                this.#logger.error(err.message);
            })

        this.#dockerComposeUp.on("close", (code) => {
            if (code === 0) {
                this.#promiseResolve()
            } else {
                this.#promiseReject(code)
            }
        })

        return this;
    }

    logs() {
        if (!this.#enable) return this;
        this.#dockerComposeUp = spawn("docker", ["compose", "-f", this.#dockerComposeFile, "logs", "-f"]);
        this.#dockerComposeUp.stdout.on("data", this.#loggerSender())

        this.#dockerComposeUp.on("error", (err) => {
            this.#logger.error(err.message);
        })

        this.#dockerComposeUp.on("close", (code) => process.exit(code))
        return this;
    }

    stop() {
        if (this.#enable) {
            this.#dockerComposeStop = spawn("docker", ["compose", "-f", this.#dockerComposeFile , "stop"]);
        }
        return this;
    }

    then(onResolve, onReject) {
        this.#promise.then(onResolve, onReject);
        return this;
    }

    catch(onReject) {
        this.#promise.catch(onReject);
        return this;
    }


    #loggerSender() {
        let endPage = ""
        return  data => {
            const text = endPage + data.toString();
            const rows = text.split("\n");
            endPage = rows.pop();
            rows.forEach(row => this.#logger.info(row))
        }
    }
}

module.exports = { NodeJSDockerCompose }
