import express from "express";
import * as bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";

const originsWhitelist = [
    "http://localhost:3000",      // this is my front-end url for production on local
    "http://localhost:8080",      // this is my front-end url for development - hot deploy
    "http://www.myproductionurl.com",
    "https://ip-react-afi4n.ondigitalocean.app"
];
const corsOptions: CorsOptions = {
    origin: function(origin, callback) {
        const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        // tslint:disable-next-line:no-null-keyword
        callback(null, isWhitelisted);
    },
    credentials: true
};

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port: number) {
        this.app = express();
        this.port = port || 48614;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(cors(corsOptions));
        this.app.options("*", cors(corsOptions));
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;