import winston, { Logger } from "winston";

class LoggingService {

    private logger: Logger;

    public constructor() {
        this.logger = winston.createLogger({
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
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