# KSM

A server manager following the KISS principle.
(**K**ISS **S**erver **M**anager)

## What is KISS

-----------------

The **KISS** principle stands for "**K**eep **I**t **S**imple, **S**tupid", and it emphasizes simplicity in design and
implementation. The
idea is that systems, software, or processes should be kept as simple as possible because simplicity leads to greater
reliability, easier maintenance, and better usability.

In the context of software development, KISS encourages developers to:

- Avoid unnecessary complexity.
- Write clear and understandable code.
- Use straightforward and minimalistic designs.
- Focus on solving the problem with the simplest approach that works.

The underlying philosophy is that most problems can be solved more effectively with simpler solutions, and complex
solutions are more prone to errors, harder to maintain, and can lead to unnecessary complications.

**- ChatGPT**

-----------------

## Philosophy

KSM focuses on simple server management that:

- Keeps servers running
- Can be easily configured from the server's project
- Aims for a plug-and-play experience
- Works with any server, regardless of its language or runtime

## Installation

```shell
npm install -g @bytelab.studio/ksm
```

> The installation requires root privileges because cronjob and other system-wide configuration files must be created.

## Commands

```shell
ksm add
```

Adds a server to the serverlist when a config file isn't given, the command looks in the current directory for
a `ksm.json` file.
Optional the `--start` flag can be set to start the server as well.

```shell
ksm remove
```

Removes a server from the serverlist when a config file isn't given, the command looks in the current directory for
a `ksm.json` file. Also, when the server is running it will be killed by ksm

```shell
ksm list
```

List all added servers.

## Configuration

```typescript
interface ServerConfig {
    cwd: string;
    ports: {
        http: number;
        https: number;
    }
    env: Record<string, string | boolean | number>;
    command: string[];
}
```

### Sample configuration

An example configuration for a express.js app

```json
{
    "cwd": ".",
    "ports": {
        "http": 2000,
        "https": 2001
    },
    "env": {
        "debug": false
    },
    "command": [
        "node",
        "./app/main.js"
    ]
}
```

The ports will be automatically added to the env as `HTTPS_PORT` and `HTTP_PORT`.
The `cwd` property is relative to the config file.
The `proxy` property is for the integrated ksm-proxy. But can be disabled at any time.

### Template configuration

```json
{
    "cwd": ".",
    "ports": {
        "http": 0,
        "https": 0
    },
    "env": {},
    "command": []
}
```

### Base configuration

KSM comes with base configuration located at `/etc/ksm/config.json`

```json
{
    "env": {
        "ksm-config": "/etc/ksm/config.json",
        "ksm-serverlist": "/etc/ksm/serverlist"
    }
}
```

Which is for configure environment variables and extensions
like [ksm-proxy](https://github.com/bytelab-studio/ksm-proxy).

## Contribution

Contributions are welcome! If you'd like to help improve KSM, feel free to submit a pull request or open an issue.
Whether it's bug fixes, new features, or documentation improvements, all contributions are appreciated.
