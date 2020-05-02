import React from 'react';
import { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import './App.css';

function App() {
  const [shoppingList, setShoppingList] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const eventSource = new EventSource('http://localhost:5000/events');
      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log("message arrived")
        console.log(parsedData)
        setShoppingList(parsedData);
      };

      setListening(true);
    }
  }, [listening, shoppingList]);

  const sendEvent = () => {
    const payload = JSON.stringify({ 
        productId: Math.floor(Math.random() * 1000),
        listId: 1,
        type: 'item_added'
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
        {shoppingList.map((item: any) => {
          return (
            <p key={item.id}>Id: {item.id}</p>
          )
        })
      }
      </div>
      <Button onClick={sendEvent} color='primary'>Add Event</Button>
    </div>
  );
}

export default App;
