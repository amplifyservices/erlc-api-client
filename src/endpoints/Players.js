class Players {
  constructor(requestHandler) {
    this.request = requestHandler;
  }

  async getList() {
    return (await this.request.execute('/server/players')).data;
  }

  async getBans() {
    return (await this.request.execute('/server/bans')).data;
  }

  async getJoinLogs() {
    return (await this.request.execute('/server/joinlogs')).data;
  }
}

module.exports = Players;
