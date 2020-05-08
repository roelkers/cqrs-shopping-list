import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import pgClient from './pgClient'
const router = express.Router()

let clients: any[] = []

const getShoppingList = async (id: string) => {
    const res = await pgClient.query('SELECT product_id, list_id from shopping_list WHERE list_id=$1',[id])
    const data = res.rows.map((item: any) => ({
        id: item.product_id,
        name: item.product_name
    }))
    return data 
}

// Middleware for POST /nest endpoint
router.post('/events', async (req: Request, res: Response, next: NextFunction) => {
    const { productId, type, listId } = req.body
    const newEvent = { type, product_id: productId, list_id: listId }
    console.log(newEvent)
    await pgClient.query('INSERT INTO events(list_id,data) VALUES ($1,$2)',[listId, JSON.stringify(newEvent)])
    // Send recently added nest as POST result

    res.json(newEvent)

    // Invoke iterate and send function
    return sendEventsToAll(listId);
})

router.get('/events/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id: listId } = req.params
    // Mandatory headers and http status to keep connection open
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'identity'
    };
    res.writeHead(200, headers);
    res.write('\n');

    const shoppingList = await getShoppingList(listId)
    console.log(shoppingList)
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
    console.log(`New Client1: ${clientId}`)

    // When client closes connection we update the clients list
    // avoiding the disconnected one
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(c => c.id !== clientId);
    });
})

// Iterate clients list and use write res object method to send new nest
async function sendEventsToAll(listId: string) {
    console.log("sending event to all clients")
    const data = await getShoppingList(listId)

    clients.forEach(c => { c.res.write(`data: ${JSON.stringify(data)}\n\n`); c.res.flush() })
}

router.get('/status', (req: Request, res: Response) => res.json({ clients: clients.length }));

export default router