
export const ERROR_SEVERITY = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

class ErrorLogger {
  log(error, severity = ERROR_SEVERITY.ERROR, additionalContext = {}) {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const logEntry = {
      timestamp,
      severity,
      message: errorMessage,
      context: additionalContext,
      stack: errorStack,
    };

    // In a real app, this might send to Sentry, LogRocket, Datadog, etc.
    if (severity === ERROR_SEVERITY.CRITICAL || severity === ERROR_SEVERITY.ERROR) {
      console.error(`[${severity}] ${timestamp}: ${errorMessage}`, logEntry);
    } else if (severity === ERROR_SEVERITY.WARNING) {
      console.warn(`[${severity}] ${timestamp}: ${errorMessage}`, logEntry);
    } else {
      console.info(`[${severity}] ${timestamp}: ${errorMessage}`, logEntry);
    }

    return logEntry;
  }
}

export const errorLogger = new ErrorLogger();
