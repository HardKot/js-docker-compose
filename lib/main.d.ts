interface ILogger {
    error(message: string): void;
    info(message: string): void;
}

export function DockerCompose(options?: { filePath?: string, logger: ILogger }): Promise<void>;