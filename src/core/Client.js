const axios = require("axios");
const { AsyncQueue } = require("@sapphire/async-queue");

class ERLCClient {
  constructor(config) {
    if (!config?.SERVER_KEY) throw new Error("SERVER_KEY is required");

    this.config = {
      baseURL: "https://api.policeroleplay.community/v1",
      enableLogging: true,
      GLOBAL_KEY: null,
      ...config,
    };

    this.queue = new AsyncQueue();
    this.connected = false;

    this.server = {
      getInfo: async () => {
        const res = await this._request("GET", "/server");
        return res.data;
      },
      getPlayers: async () => {
        const res = await this._request("GET", "/server/players");
        return res.data;
      },
      getBans: async () => {
        const res = await this._request("GET", "/server/bans");
        return res.data;
      },
      getVehicles: async () => {
        const res = await this._request("GET", "/server/vehicles");
        return res.data;
      },
      getJoinLogs: async () => {
        const res = await this._request("GET", "/server/joinlogs");
        return res.data;
      },
      getKillLogs: async () => {
        const res = await this._request("GET", "/server/killlogs");
        return res.data;
      },
      getCommandLogs: async () => {
        const res = await this._request("GET", "/server/commandlogs");
        return res.data;
      },
      getModCalls: async () => {
        const res = await this._request("GET", "/server/modcalls");
        return res.data;
      },
      getQueue: async () => {
        const res = await this._request("GET", "/server/queue");
        return res.data;
      },
    };

    this.commands = {
      send: async (command) => {
        const res = await this._request("POST", "/server/command", { command });
        return res.data;
      },
    };
  }

  async connect() {
    try {
      const headers = {
        "Server-Key": this.config.SERVER_KEY,
      };

      if (this.config.GLOBAL_KEY) {
        headers["Authorization"] = this.config.GLOBAL_KEY;
      }

      const response = await axios.get(`${this.config.baseURL}/server`, {
        headers,
        validateStatus: () => true,
      });

      if (response.status === 403) {
        throw new Error("Invalid SERVER_KEY or GLOBAL_KEY");
      }

      this.connected = true;
      if (this.config.enableLogging) {
        console.log(`✅ Connected to "${response.data.Name}"`);
      }
      return response.data;
    } catch (error) {
      this.connected = false;
      throw new Error(
        `Connection failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async _request(method, endpoint, data) {
    if (!this.connected && endpoint !== "/server") {
      throw new Error("Client not connected - call connect() first");
    }

    await this.queue.wait();
    try {
      const headers = {
        "Server-Key": this.config.SERVER_KEY,
        "Content-Type": "application/json",
      };

      if (this.config.GLOBAL_KEY) {
        headers["Authorization"] = this.config.GLOBAL_KEY;
      }

      if (this.config.enableLogging) {
        console.log(`⚡ ${method} ${endpoint}`);
      }

      const response = await axios({
        method,
        url: `${this.config.baseURL}${endpoint}`,
        headers,
        data,
        validateStatus: () => true,
      });

      if (response.headers["x-ratelimit-remaining"] === "0") {
        const resetTime =
          parseInt(response.headers["x-ratelimit-reset"]) * 1000;
        const waitTime = resetTime - Date.now() + 1000;
        if (this.config.enableLogging) {
          console.log(`⏳ Rate limited - waiting ${waitTime}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      if (response.status >= 400) {
        throw new Error(
          response.data?.message || `API error: ${response.status}`
        );
      }

      return response;
    } catch (error) {
      if (this.config.enableLogging) {
        console.error(`❌ ${method} ${endpoint} failed:`, error.message);
      }
      throw error;
    } finally {
      this.queue.shift();
    }
  }
}

module.exports = ERLCClient;
