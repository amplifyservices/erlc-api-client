function validateAPIKey(key) {
  if (!key || typeof key !== 'string' || key.length < 32) {
    throw new Error('Invalid API key format');
  }
  return true;
}

function formatCommand(command) {
  return command.startsWith(':') ? command : `:${command}`;
}

module.exports = { validateAPIKey, formatCommand };
