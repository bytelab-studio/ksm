let cliModeIsEnabled: boolean = false;

export function enableCLIMode(): void {
    cliModeIsEnabled = true;
}

export function handleException(e: unknown): never {
    if (cliModeIsEnabled) {
        process.exit(1);
    }
    throw e;
}