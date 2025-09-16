const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(filename, message) {
    if (process.env.NODE_ENV !== 'test') {
      fs.appendFile(filename, message + '\n', (err) => {
        if (err) console.error('Failed to write to log file:', err);
      });
    }
  }

  log(level, message, data = null) {
    const formattedMessage = this.formatMessage(level, message, data);
    
    // Console output with colors
    const colors = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow  
      error: '\x1b[31m',   // Red
      debug: '\x1b[35m',   // Magenta
      reset: '\x1b[0m'     // Reset
    };

    console.log(`${colors[level] || colors.reset}[${level.toUpperCase()}]${colors.reset} ${message}`);
    if (data) {
      console.log(data);
    }

    // Write to files
    this.writeToFile(this.logFile, formattedMessage);
    if (level === 'error') {
      this.writeToFile(this.errorFile, formattedMessage);
    }
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }
}

module.exports = new Logger();