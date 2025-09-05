export const TCP_CONFIGURATION = {
    port: 4777,
    onServerStartedHandler: () => { console.log('TCP server started') },
    onClientConnectHandler: () => { console.log('Client connected') }
}

export const STORAGE_CONFIGURATION = {
    baseDir: './data/uploads'
}

export const APP_CONFIG = {
    level: 'info'
}