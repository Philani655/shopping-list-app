import http, { IncomingMessage, ServerResponse } from "http";
import { ItemsRoute } from "./routers/items";

const PORT = 4000

const requestListiner = (req: IncomingMessage, res: ServerResponse) => {
    console.log(req.url, "/url");
    
    if(req.url?.startsWith("/items")) {
        ItemsRoute(req, res)
    } else {
        res.writeHead(200, {"content-type": "application/JSON"})
        res.end(JSON.stringify({message: "Hello world"}))
    }
}

const server = http.createServer(requestListiner)

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})