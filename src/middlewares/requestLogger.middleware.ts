import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [sec, nano] = process.hrtime(start);
    const ms = (sec * 1e3 + nano / 1e6).toFixed(3);
    const log = {
      time: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: ms,
      ip: req.ip,
    };
    // Log as a single JSON line for easier ingestion by log systems
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(log));
  });

  next();
};
