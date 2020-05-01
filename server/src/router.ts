import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
const router = express.Router()

let clients: any[] = []
let events: any[] = []

router.get('/hi', (req: Request, res: Response) => {
    res.send("hiai")
})
// Middleware for POST /nest endpoint
router.post('/events', (req: Request, res: Response, next: NextFunction) => {
    const newEvent = req.body;
    events.push(newEvent);
    // Send recently added nest as POST result
    res.json(newEvent)
    console.log(events)
    // Invoke iterate and send function
    return sendEventsToAll(newEvent);
})

router.get('/events', (req, res, next) => {
    // Mandatory headers and http status to keep connection open
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'identity'
    };
    res.writeHead(200, headers);
    res.write('\n');

    // After client opens connection send all nests as string
    const data = `data: ${JSON.stringify(events)}\n\n`;
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
function sendEventsToAll(event: any) {
    console.log("sending event to all clients")
    clients.forEach(c => { c.res.write(`data: ${JSON.stringify(event)}\n\n`); c.res.flush() })
}

router.get('/status', (req: Request, res: Response) => res.json({ clients: clients.length }));

export default router