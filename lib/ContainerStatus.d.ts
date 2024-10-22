export class ContainerStatus {
    constructor(name: string, status: string, configFiles: string);

    public name: string;
    public status: string;
    public configFiles: string;
}