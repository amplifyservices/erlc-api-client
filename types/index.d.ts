declare module 'erlc-api-client' {
  interface ERLCClientOptions {
    baseURL?: string;
    globalRateDelay?: number;
  }

  class ERLCClient {
    constructor(apiKey: string, options?: ERLCClientOptions);
    server: {
      getInfo(): Promise<any>;
      getQueue(): Promise<any>;
      getVehicles(): Promise<any>;
    };
    players: {
      getList(): Promise<any>;
      getBans(): Promise<any>;
      getJoinLogs(): Promise<any>;
    };
    commands: {
      send(command: string): Promise<any>;
    };
  }

  export = ERLCClient;
}
