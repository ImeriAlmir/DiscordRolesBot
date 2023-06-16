import winston, { Logger } from "winston";
import path from "path";
class LoggingService {

    private logger: Logger;

    public constructor() {
        const logFilePath = path.resolve(__dirname, '../../../logs/error_logs.log');

        this.logger = winston.createLogger({
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: logFilePath,
                    level: "error",
                    format: winston.format.json()
                })
            ]
        });
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}

export default LoggingService;