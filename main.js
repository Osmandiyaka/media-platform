import Cli from './src/cli/cli.js';
import UserManager from './src/identity-and-access-management/user-manager.js';
import UserProvider from './src/identity-and-access-management/user-provider.js';


(async function main() {
    const userProvider = new UserProvider();
    const userManager = new UserManager(userProvider);
    const cli = new Cli(userManager);
    cli.run();
})();