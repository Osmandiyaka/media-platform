import Cli from './src/cli/cli.js';
import * as config from './configuration.js';
import buildContainer from './build-container.js'

(async function main() {
    const container = buildContainer(config);
    const { userManager, tcpServer } = container;
    function getCommands() {

    }
    const commands = getCommands();
    const cli = new Cli({ userManager, tcpServer, commands });
    await cli.run();
})()