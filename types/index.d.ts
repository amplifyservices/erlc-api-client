declare module 'erlc-api-client' {
  interface ERLCClientConfig {
    API_KEY: string;
    baseURL?: string;
    enableLogging?: boolean;
    globalRateDelay?: number;
  }

  // Core Types
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
    Player: string; // "PlayerName:Id"
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

  // Endpoint Interfaces
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

  // Main Client
  class ERLCClient {
    constructor(config: ERLCClientConfig);
    
    /**
     * Connect to the API and verify credentials
     * @throws {Error} If API key is invalid
     */
    connect(): Promise<ServerInfo>;

    /**
     * Server information endpoints
     */
    server: ServerEndpoints;

    /**
     * Command execution endpoints
     */
    commands: CommandsEndpoints;

    /**
     * Current connection status
     */
    readonly connected: boolean;

    // Events
    on(event: 'connect', listener: (serverInfo: ServerInfo) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'rateLimit', listener: (data: { bucket: string; retryAfter: number }) => void): this;
  }

  export = ERLCClient;
}
