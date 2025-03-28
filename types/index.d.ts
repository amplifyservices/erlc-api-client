declare module 'erlc-api-client' {
  interface ERLCClientConfig {
    API_KEY: string;
    baseURL?: string;
    enableLogging?: boolean;
    globalRateDelay?: number;
  }

  interface ServerInfo {
    Name: string;
    OwnerId: number;
    CoOwnerIds: number[];
    CurrentPlayers: number;
    MaxPlayers: number;
    JoinKey: string;
    AccVerifiedReq: 'Disabled' | 'Email' | 'Phone/ID';
    TeamBalance: boolean;
    Version?: string;
  }

  interface Player {
    Player: string;
    Permission: 'Normal' | 'Server Administrator' | 'Server Owner' | 'Server Moderator';
    Callsign: string | null;
    Team: string;
  }

  interface JoinLog {
    Join: boolean;
    Timestamp: number;
    Player: string;
  }

  interface KillLog {
    Killed: string;
    Timestamp: number;
    Killer: string;
  }

  interface CommandLog {
    Player: string;
    Timestamp: number;
    Command: string;
  }

  interface ModCall {
    Caller: string;
    Moderator: string | null;
    Timestamp: number;
  }

  interface Vehicle {
    Texture: string | null;
    Name: string;
    Owner: string;
  }

  interface ServerEndpoints {
    getInfo(): Promise<ServerInfo>;
    getPlayers(): Promise<Player[]>;
    getBans(): Promise<Record<string, string>>;
    getVehicles(): Promise<Vehicle[]>;
    getJoinLogs(): Promise<JoinLog[]>;
    getKillLogs(): Promise<KillLog[]>;
    getCommandLogs(): Promise<CommandLog[]>;
    getModCalls(): Promise<ModCall[]>;
    getQueue(): Promise<number[]>;
  }

  interface CommandsEndpoints {
    send(command: string): Promise<void>;
  }

  class ERLCClient {
    constructor(config: ERLCClientConfig);
    connect(): Promise<ServerInfo>;
    server: ServerEndpoints;
    commands: CommandsEndpoints;
    readonly connected: boolean;
    on(event: 'connect', listener: (serverInfo: ServerInfo) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'rateLimit', listener: (data: { bucket: string; retryAfter: number }) => void): this;
  }

  export = ERLCClient;
}
