import express, { NextFunction } from "express";
import { Request, Response } from "express";
import pgClient from "./pgClient";
const router = express.Router();

let clients: any[] = [];

const getShoppingList = async (id: string) => {
    const {rows} = await pgClient.query("SELECT product_id, product_name, list_id, category, checked from shopping_list");
    const data = rows
    .map((item: any) => ({
        id: item.product_id,
        name: item.product_name,
        checked: item.checked,
        category: item.category,
        list_id: item.list_id,
    }))
    .reduce((r: any, a: any) => {
        r[a.list_id] = r[a.list_id] || [];
        r[a.list_id].push(a);
        return r;
    }, Object.create(null));
    return data;
};

// Middleware for POST /nest endpoint
router.post("/events", async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const event = { ...req.body };
    if (type === "list_added") {
       const { rows } = await pgClient.query(`SELECT nextval('list_id_seq')`);
       event.list_id = rows[0].nextval;
    }
    await pgClient.query("INSERT INTO events(data) VALUES ($1)", [JSON.stringify(event)]);
    // Send recently added nest as POST result

    res.sendStatus(200);
    // Invoke iterate and send function
    if (req.body.list_id) {
      return sendEventsToAll(req.body.list_id);
    }
});

router.get("/list-data", async (req: Request, res: Response, next: NextFunction) => {
    const { id: listId } = req.params;
    // Mandatory headers and http status to keep connection open
    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Encoding": "identity"
    };
    res.writeHead(200, headers);
    res.write("\n");

    const shoppingList = await getShoppingList(listId);
    // After client opens connection send all nests as string
    const data = `data: ${JSON.stringify(shoppingList)}\n\n`;
    res.write(data);

    // Generate an id based on timestamp and save res
    // object of client connection on clients list
    // Later we'll iterate it and send updates to each client
    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on("close", () => {
        clients = clients.filter((c) => c.id !== clientId);
    });
});

// Iterate clients list and use write res object method to send new nest
async function sendEventsToAll(listId: string) {
    const data = await getShoppingList(listId);

    clients.forEach((c) => { c.res.write(`data: ${JSON.stringify(data)}\n\n`); c.res.flush(); });
}

router.get("/status", (req: Request, res: Response) => res.json({ clients: clients.length }));

export default router;
