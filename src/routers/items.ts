import http, { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemsById, addItems, deleteItem, updateItem  } from "../controllers/items";
import { error } from "console";

export const ItemsRoute = (req: IncomingMessage, res: ServerResponse) => {
    if(req.url?.startsWith("/items")) {

        const parts = req.url.split("/");

        const id = parts[2] ? parseInt(parts[2]) : undefined

        if(req.method === "GET" && !id) {
            res.writeHead(200,  {"content-type" : "application/json"});
            res.end(JSON.stringify(getItems()));
            return;
        }

        if(req.method === "GET" && id) {

            if(isNaN(id)) {
                res.writeHead(400, {"content-type" : "application/json"});
                res.end(JSON.stringify({error: "Invalid item Id"}));
                return;
            }

            const item = getItemsById(id);
            if(!item) {
                res.writeHead(404, {"content-type" : "application/json"});
                res.end(JSON.stringify({ error: "Item Not found" }));
                return
            }

            res.writeHead(200, {"content-type" : "application/json"});
            res.end(JSON.stringify(item));
            return;
        }

        if(req.method === "POST") {
            let body = "";
            
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {

                try {
                    const {name, quantity, purchasedStatus, price} = JSON.parse(body);

                    if(!name || typeof name !== "string") {
                        res.writeHead(400, {"content-type" : "application/json"});
                        res.end(JSON.stringify({error: "Item name is required"}))
                    }

                    if(!quantity || typeof quantity !== "number") {
                        res.writeHead(400, {"content-type" : "application/json"});
                        res.end(JSON.stringify({error: "Item Quantity is required"}));
                    }

                    if(!purchasedStatus || typeof purchasedStatus !== "string") {
                        res.writeHead(400, {"content-type" : "application/json"});
                        res.end(JSON.stringify({error: "Item purchase status not found"}));
                    }

                    if(!price || typeof price !== "number") {
                        res.writeHead(400, { "content-type" : "application/json" });
                        res.end(JSON.stringify({error: "Item price not found"}));
                    }

                    const newItem = addItems(name, quantity, purchasedStatus, price);
                    res.writeHead(201, {"content-type" : "application/json"});
                    res.end(JSON.stringify(newItem));

                } catch (error) {
                    res.writeHead(400, {"content-type" : "application/json"});
                    res.end(JSON.stringify({error: "Invalid JSON payload"}));
                }
            });
            return;
        }


        if(req.method === "DELETE" && id) {

            const item = getItemsById(id);
            if(!item) {
                res.writeHead(404, {"content-type" : "application/json"});
                res.end(JSON.stringify({ error: "Item Not found" }));
                return
            }

            res.writeHead(204, {"content-type" : "application/json"});
            res.end(JSON.stringify(deleteItem(id)));
            return;
            
        }

        if(req.method === "PUT" && id) {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                
                try {
                    const updatedData = JSON.parse(body);

                    const updatedItem = updateItem(id, updatedData);
                    if(!updatedItem) {
                        res.writeHead(404, {"content-type" : "application/json"});
                        res.end(JSON.stringify({ error: "Item not found" }));
                    }

                    res.writeHead(200, {"content-type" : "application/json"});
                    res.end(JSON.stringify(updatedItem));
                } catch (error) {
                    res.writeHead(400, {"content-type" : "application/json"});
                    res.end(JSON.stringify({error: "Invalid payload JSON"}));
                }
                
            }); 
            return;
        }

        res.writeHead(405, {"content-type" : "application/json"});
        res.end(JSON.stringify({error: "Method not allowed on /items"}));
        
    }
};