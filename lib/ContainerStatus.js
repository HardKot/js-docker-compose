class ContainerStatus {
    name = "";
    status = "";
    configFiles = [""];

    constructor(name, status, ...configFiles) {
        this.name = name;
        this.status = status;
        this.configFiles = configFiles;
    }
}

module.exports = { ContainerStatus };