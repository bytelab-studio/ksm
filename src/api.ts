export type IPString = `${number}.${number}.${number}`;
export type ENVValue = string | number | boolean;

export interface ProxyConfig {
    enable: boolean;
    ports: {
        http: number;
        https: number;
    }
    security: {
        cert: {
            public: string;
            private: string;
        }
        "https-redirect": boolean;
        "ip-blacklist": IPString[];
    }
}

export interface Config {
    env: Record<string, ENVValue>;
}

export interface ServerConfig {
    cwd: string;
    ports: {
        http: number;
        https: number;
    }
    env: Record<string, ENVValue>;
    command: string[];
}

export interface ServerEntry {
    pid: number | -1;
    path: string;
}

export type Serverlist = ServerEntry[];

export * from "./validator";
export * from "./controller";
export * from "./config";
export {enableCLIMode} from "./utils";