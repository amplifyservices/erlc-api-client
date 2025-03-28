declare module 'erlc-api-client' {
  interface ERLCClientOptions {
    baseURL?: string;
    globalRateDelay?: number;
  }

  class ERLCClient {
    constructor(apiKey: string, options?: ERLCClientOptions);
    
    server: {
      getInfo(): Promise<any>;
      getPlayers(): Promise<any>;
      getQueue(): Promise<any>;
      getJoinLogs(): Promise<any>;
      getKillLogs(): Promise<any>;
      getCommandLogs(): Promise<any>;
      getModCalls(): Promise<any>;
      getBans(): Promise<any>;
      getVehicles(): Promise<any>;
    };

    commands: {
      send(command: string): Promise<any>;
    };
  }

  export = ERLCClient;
}
