module.exports = {
  networks: {
    // Configuration for Ganache (Local Development)
    development: {
      host: "127.0.0.1", // Localhost for Ganache
      port: 8545, // Default port for Ganache
      network_id: "*", // Ganache's network ID
    },

    // Example for Goerli Testnet (requires HDWalletProvider)
    // Uncomment and configure for public network usage
    // goerli: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       process.env.MNEMONIC,
    //       `https://goerli.infura.io/v3/${process.env.PROJECT_ID}`
    //     ),
    //   network_id: 5,          // Goerli's network ID
    //   confirmations: 2,       // # of confirmations to wait
    //   timeoutBlocks: 200,     // # of blocks before timing out
    //   skipDryRun: true,       // Skip dry run
    // },
  },

  // Compiler configuration
  compilers: {
    solc: {
      version: "0.8.13", // Solidity version to use
      settings: {
        optimizer: {
          enabled: true, // Enable optimization
          runs: 200, // Optimize for how many times you intend to run the code
        },
      },
    },
  },

  // Mocha testing framework configuration
  mocha: {
    timeout: 100000, // Set timeout for tests
  },

  // Truffle DB configuration (disabled by default)
  db: {
    enabled: false, // Set to true to enable Truffle DB
  },
};
