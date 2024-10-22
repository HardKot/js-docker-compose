import {ContainerStatus } from "./ContainerStatus";

interface ILogger {
    error(message: string): void;
    info(message: string): void;
}

export class NodeJSDockerCompose {
    constructor()
    constructor(options: { file?: string, logger: ILogger })

    autoStart(): NodeJSDockerCompose;

    ls(): ContainerStatus[]
    up(): NodeJSDockerCompose;
    stop(): NodeJSDockerCompose;
    logs(): NodeJSDockerCompose;

    catch(onReject: ((reason: any) => (PromiseLike<void> | void)) | undefined | null): NodeJSDockerCompose;
    then(onResolve?: ((value: void) => PromiseLike<void> | void) | undefined | null, onRejected?: ((reason: any) => (PromiseLike<void> | void)) | undefined | null): NodeJSDockerCompose;
}