//export const DERI_ENV="dev"
export const DeriEnv = (() => {
  let _deriEnv = "dev"
  return {
    get: () => {
      return _deriEnv
    },
    set: (value) => {
      if (value === "dev" || value === "prod" || value === "production" ) {
        _deriEnv = value
      } else {
        throw new Error("please use 'dev' or 'prod' for DeriEnv")
      }
    }
  }
})()

export const getDBProviderUrlsConfig = () => {
  return [
    //"https://data-seed-prebsc-1-s1.binance.org:8545/",
    "https://data-seed-prebsc-1-s2.binance.org:8545/",
    "https://data-seed-prebsc-1-s3.binance.org:8545/",
    "https://data-seed-prebsc-2-s1.binance.org:8545/",
    "https://data-seed-prebsc-2-s2.binance.org:8545/",
    "https://data-seed-prebsc-2-s3.binance.org:8545/",
  ];
};

export const getDBAddressConfig = (env = "dev", useProductionDB = false) => {
  if (env === "prod" && useProductionDB) {
    // for production
    return "0x824B6238EdCbaCCAF83C3F60C0cEB38bEb7C9e89";
  } else {
    // for test
    return "0x7C1267188379f57d92e640E519151229E1eA5565";
  }
};

export const ChainProviderUrls = [
  {
    provider_urls: [
      "https://mainnet.infura.io/v3/d0e6582644a845ee8d7c3c18683fec06",
      //"https://mainnet.infura.io/v3/ec73e2f0c79a42c0997ee535364de584",
    ],
    chainId: "1",
  },
  {
    provider_urls: [
      "https://bsc-dataseed.binance.org",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed1.ninicoin.io/",
    ],
    chainId: "56",
  },
  {
    provider_urls: ["https://http-mainnet.hecochain.com"],
    chainId: "128",
  },
  {
    provider_urls: [
      //"https://ropsten.infura.io/v3/d0e6582644a845ee8d7c3c18683fec06",
      "https://ropsten.infura.io/v3/ec73e2f0c79a42c0997ee535364de584",
    ],
    chainId: "3",
  },
  {
    provider_urls: [
      //"https://kovan.infura.io/v3/d0e6582644a845ee8d7c3c18683fec06",
      "https://kovan.infura.io/v3/ec73e2f0c79a42c0997ee535364de584",
    ],
    chainId: "42",
  },
  {
    provider_urls: [
      //"https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-1-s2.binance.org:8545/",
      "https://data-seed-prebsc-1-s3.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s2.binance.org:8545/",
      "https://data-seed-prebsc-2-s3.binance.org:8545/",
    ],
    chainId: "97",
  },
  {
    provider_urls: ["https://http-testnet.hecochain.com"],
    chainId: "256",
  },
  {
    provider_urls: [
      "https://rpc-mainnet.matic.network",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet.chainstacklabs.com",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
      "https://matic-mainnet-archive-rpc.bwarelabs.com",
    ],
    chainId: "137",
  },
  {
    provider_urls: [
      "https://rpc-mumbai.matic.today",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-mumbai.chainstacklabs.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
    ],
    chainId: "80001",
  },
];
interface Config {
  pool:string,
  bToken:string,
  pToken:string,
  lToken:string,
  initialBlock:string,
  bTokenSymbol:string,
  symbol:string,
  chainId:string
}
export const getContractAddressConfig = (env = "dev"): Config[] => {
  // production environment
  if (env === "prod") {
    //console.log('!!! production !!!')
    return [
      {
        pool: "0xAf081e1426f64e74117aD5F695D2A80482679DE5",
        bToken: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        pToken: "0x3c11c4990447F0AD575eBd74E8cD17bf61848A15",
        lToken: "0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9",
        initialBlock: "7906919",
        bTokenSymbol: "BUSD",
        symbol: 'BTCUSD',
        chainId: "56",
      },
      {
        pool: '0x011346B81e5326904B5B76A11dECAf2c67eFFc23',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        pToken: '0xaE6429b4CDDDFefDB6ac702183c836B4e62Da410',
        lToken: '0xd8f78c47b0e0943B3Cb2cE1e1726472C4ddd2F98',
        initialBlock: '6753399',
        bTokenSymbol: 'BUSD',
        symbol: 'COIN',
        chainId: '56',
      },
      {
        pool:   '0xD3f5E6D1a25dA1E64EDf7cb571f9fAD17FEb623c',
        bToken: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
        pToken: '0x29Be63E854727BB3Fef77eB107B8d1c33081f989',
        lToken: '0x610b39F9ba0fF2167AEb646462473c011A431Cd7',
        initialBlock: '8005906',
        bTokenSymbol: 'DERI',
        symbol: 'iMEME',
        chainId: '56',
      },
      {
        pool:   "0x23779AAc1e74a65F27B4840A8E41F767Ce993118",
        bToken: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        pToken: "0x9c6134F9e759C6812aaC102FC1a9f7cA5615fD33",
        lToken: "0x43CA6D7129d7F490d5B91B4D14D7c877D15A92dA",
        initialBlock: "11949433",
        bTokenSymbol: "USDT",
        symbol: 'BTCUSD',
        chainId: "1",
      },
      {
        pool:   "0x96a1F15676746b9339DBc185F277618359Ac6346",
        bToken: "0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a",
        pToken: "0x15aD9b67cf54037127fD986Ca3bB775f9FC4ad05",
        lToken: "0xeC27d4c53C2E29F1113A9667c0B19442df83c1f1",
        initialBlock: "11860070",
        bTokenSymbol: "BAC",
        symbol: 'BTCUSD',
        chainId: "1",
      },
      {
        pool:   "0xBA7e183042c8796E26A5a2375927DE7B1AB99d97",
        bToken: "0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047",
        pToken: "0x732Ba556B304fd74Cd14b74ab8762A7D9f26d476",
        lToken: "0x90fE976Cbb48E0761A84DDA2974024377994a997",
        initialBlock: "2557914",
        bTokenSymbol: "HUSD",
        symbol: 'BTCUSD',
        chainId: "128",
      },
    ];
  } else {
    // develop environment
    //console.log('-- test ---')
    return [
      {
        pool: '0x372b640A00a0A6B73381e9363A39644a712cCc37',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        pToken: '0xB9113758D771750e9E8ECb359A19689eC89AC1a5',
        lToken: '0xC727a10Be4740441BE74960296097aF39D701980',
        initialBlock: '9368015',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        chainId: '97',
      },
    ];
  }
};

export const getSlpContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
        bToken: '0xA3DfbF2933FF3d96177bde4928D0F5840eE55600',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        chainId: '1',
        bTokenSymbol: 'DERI-USDT SLP ONSEN',
      },
    ];
  }
  console.log('getSlpContractAddressConfig(): no config for dev environment');
  return [];
};

export const getClpContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0x4de2Ac273aD1BBe2F5C41f986d7b3cef8383Df98',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x83b31Abc899863B8Eb06952994580CE86414156E',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '6894880',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP',
        symbol: 'BTCUSD',
      },
    ];
  } else {
    return [
      {
        pool: '0x7aad5ADF82d8B85c826c91924AcdACafAAA945f5',
        bToken: '0x76340AB22aECAaa8f52D5341d2df404CBA966039',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0xd2138766005FAB46E20e6F7e1C4C32A375CfAC56',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '8309032',
        chainId: '97',
        bTokenSymbol: 'CAKE-LP',
        symbol: 'BTCUSD',
      },
    ];
  }
};

export const getDeriContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        Deri: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        Wormhole: '0x6874640cC849153Cb3402D193C33c416972159Ce',
        bTokenSymbol: 'DERI',
        chainId: '1',
      },
      {
        Deri: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
        Wormhole: '0x15a5969060228031266c64274a54e02Fbd924AbF',
        bTokenSymbol: 'DERI',
        chainId: '56',
      },
      {
        Deri: '0x2bdA3e331Cf735D9420e41567ab843441980C4B8',
        Wormhole: '0x134A04497e9a0b1F8850fEaf87eD18ec348dDa46',
        bTokenSymbol: 'DERI',
        chainId: '128',
      },
    ];
  }
  return [
    {
      Deri: '0x88Fe79a3b6AC7EeF3d55B2e388fa18400590698B',
      Wormhole: '0xcb28Fa7dFa1844Cdb47aD5f03484f6131293Fd2e',
      bTokenSymbol: 'DERI',
      chainId: '3',
    },
    {
      Deri: '0x8dC0aA48bbc69BaCD2548c6b7adCDeF8DDbA50B2',
      Wormhole: '0x9028e43114Df57C97c15355224E575DF1e244919',
      bTokenSymbol: 'DERI',
      chainId: '97',
    },
    {
      Deri: '0x932458a637F8060AF747167656651b64d4c36620',
      Wormhole: '0x629B0D3D32BE5ee5F7BF3845914d26446c04165d',
      bTokenSymbol: 'DERI',
      chainId: '256',
    },
  ];
};

export const getAnnualBlockNumberConfig = () => ({
  1: '2367422',
  56: '10497304',
  128: '10511369',
  3: '2367422',
  97: '10497304',
  256: '10511369',
});

export const getRedisServerConfig = (env = "dev") => {
  if (env === "prod") {
    return {
      host: "127.0.0.1",
      port: "6379",
      db: "5",
    };
  } else {
    return {
      host: "127.0.0.1",
      port: "6379",
      db: "5",
    };
  }
};
export const getRedisWorkerQueneConfig = (env = "dev") => {
  if (env === "prod") {
    return ['trade_tx_quene', 'trade_worker_group']
  } else {
    return ['trade_tx_quene_dev', 'trade_worker_group_dev']
  }
};

export const getClp2ContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '699498',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP ONSEN',
        symbol: '--',
      }
    ]
  } else {
    return []
  }
}


export const validateObjectKeyExist = (keyList, val, valName) => {
  const keys = Object.keys(val);
  keyList.forEach((prop) => {
    if (!keys.includes(prop)) {
      throw new Error(
        `validateConfig(): property ${prop} is not exist in the ${valName} config.`
      );
    }
  });
};
export const validateIsArray = (val, valName) => {
  if (!Array.isArray(val)) {
    throw new Error(
      `validateConfig(): property ${valName} is an array in the config.`
    );
  }
};

const validateConfig = (config) => {
  validateObjectKeyExist(
    [
      'pool',
      'pToken',
      'lToken',
      'router',
      'initialBlock',
      'bTokens',
      'symbols',
      'chainId',
    ],
    config,
    ''
  );
  validateIsArray(config['bTokens'], 'bTokens');
  config['bTokens'].forEach((prop) => {
    validateObjectKeyExist(
      ['bTokenId', 'bTokenSymbol', 'bToken'],
      prop,
      'bToken'
    );
  });
  validateIsArray(config['symbols'], 'symbols');
  config['symbols'].forEach((prop) => {
    validateObjectKeyExist(['symbolId', 'symbol'], prop, 'bToken');
  });
};

const processConfig = (config) => {
  // process config
  config['bTokenCount'] = config['bTokens'].length;
  config['symbolCount'] = config['symbols'].length;
};

export const getPoolConfigList = (env = "dev") => {
  let configs = [];
  if (env === "prod") {
    configs = configs.concat([
      {
        pool: "0x19c2655A0e1639B189FB0CF06e02DC0254419D92",
        pToken: "0x2AA5865BF556ab3f6Cd9405e565099f70234dF05",
        lToken: "0x6f8F1C2781b555B63F1A1BE85BF99aEe27d87cB2",
        router: "0xC9C234243f48Fa05A993c29B4F5f93048f5b07E4",
        initialBlock: "7884650",
        bTokens: [
          {
            bTokenId: "0",
            bTokenSymbol: "BUSD",
            bToken: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          },
        ],
        symbols: [
          {
            symbolId: "0",
            symbol: "BTCUSD",
            unit: "BTC",
          },
          {
            symbolId: "1",
            symbol: "ETHUSD",
            unit: "ETH",
          },
        ],
        chainId: "56",
      },
    ]);
  } else {
    configs = configs.concat([
      {
        pool: "0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5",
        pToken: "0x270128C2d7E8713c8c25F7800738C29214eAFeBA",
        lToken: "0x904262d92B21e5214278632d01405738d841d82a",
        router: "0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6",
        initialBlock: "9516935",
        bTokens: [
          {
            bTokenId: "0",
            bTokenSymbol: "BUSD",
            bToken: "0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF",
          },
          {
            bTokenId: "1",
            bTokenSymbol: "AUTO",
            bToken: "0xd2F37BADdB702FF778aA038C63b7068054d93508",
          },
          {
            bTokenId: "2",
            bTokenSymbol: "CAKE",
            bToken: "0x5b403E0f6686725171c2Baa7A0b7cD4253B0bc57",
          },
        ],
        symbols: [
          {
            symbolId: "0",
            symbol: "ETHUSD",
            unit: "ETH",
          },
          {
            symbolId: "1",
            symbol: "MATICUSD",
            unit: "MATIC",
          },
        ],
        chainId: "97",
      },
      {
        pool: "0x35a85396e7A8a9E85170fbb589ce085abcAd8266",
        pToken: "0x3495f770eC0dc8701d2b89454047A8521306E070",
        lToken: "0xeFCbBF65100FC2C2b96E92c9AbFfeC384177943e",
        router: "0x4861a9958B65eA8146B89Af929a80c352c905270",
        initialBlock: "14917984",
        bTokens: [
          {
            bTokenId: "0",
            bTokenSymbol: "USDT",
            bToken: "0x1BD7B233B054AD4D1FBb767eEa628f28fdE314c6",
          },
        ],
        symbols: [
          {
            symbolId: "0",
            symbol: "ETHUSD",
            unit: "ETH",
          },
          {
            symbolId: "1",
            symbol: "MATICUSD",
            unit: "MATIC",
          },
        ],
        chainId: "80001",
        version: "v2",
      },
    ]);
  }
  return configs.map((c) => {
    validateConfig(c)
    processConfig(c)
    //console.log(c)
    return c
  });
};

export const getOracleConfigList = (env = "dev") => {
  if (env === "prod") {
    return [
      {
        chainId: "56",
        symbol: "BTCUSD",
        address: "0xe3C58d202D4047Ba227e437b79871d51982deEb7",
      },
      {
        chainId: "56",
        symbol: "ETHUSD",
        address: "0x9BA8966B706c905E594AcbB946Ad5e29509f45EB",
      },
    ];
  } else {
    return [
      {
        chainId: "97",
        symbol: "BTCUSD",
        address: "0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9",
      },
      {
        chainId: "97",
        symbol: "ETHUSD",
        address: "0x36aF683ba23ef721780FCc0e64F25EB72B294020",
      },
    ];
  }
};

export const getMySQLConfig = () => {
  return {
    host: '127.0.0.1',
    port: '3306',
    user: process.env.DERI_MYSQL_USERNAME || 'root',
    password: process.env.DERI_MYSQL_PASSWORD || 'bitSpace',
    database: 'deri_prod',
  }
}

export const getBrokerMySQLConfig = () => {
  return {
    host: '172.31.87.216',
    port: '3306',
    user: process.env.DERI_BROKER_MYSQL_USERNAME || 'root',
    password: process.env.DERI_BROKER_MYSQL_PASSWORD || 'bitSpace',
    database: 'deri_mining',
  }
}

export const getBrokerMySQLTableName = () => {
  if (DeriEnv.get() === 'prod') {
    return 'deri_mining_broker_details'
  } else {
    return 'temp_deri_mining_broker_details'
  }
}
