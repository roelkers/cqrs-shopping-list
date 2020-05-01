import React from 'react';
import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const eventSource = new EventSource('http://localhost:5000/events');
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log("message arrived")
        console.log(parsedData)
        setEvents((events) => events.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, events]);

  const sendEvent = () => {
    const payload = JSON.stringify({ 
        id: Math.floor(Math.random() * 1000),
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    })
    fetch('http://localhost:5000/events', {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return (
    <div>
      <div>
        {events.map((event: any) => {
          return (
            <p key={event.id}>Id: {event.id}</p>
          )
        })
      }
      </div>
      <Button onClick={sendEvent} color='primary'>Add Event</Button>
    </div>
  );
}

export default App;
