import { useRecoilState, useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { listDataState, listIdState } from "./atoms";
import { createEventSource } from "./client";
import { listItemsState } from "./selectors";

const useListItems : () => (id: string) => void = () => {
  const [listData, setListItems] = useRecoilState(listDataState);
  const [listening, setListening] = useState(false);
  const listId = useRecoilValue(listIdState)
  const listItems = useRecoilValue(listItemsState)

  useEffect(() => {
    if (!listening) {
      const eventSource = createEventSource() 
      eventSource.onmessage = async (event) => {
        const parsedData = JSON.parse(event.data) as any
        const jsonResponse = new Response(event.data, {
          headers: {
            'content-type': 'application/json'
          }
        })
        const map = new Map(Object.entries(parsedData))
        setListItems(map);
        //update cache if we have access to it
        if(window.caches) {
          const cache = await window.caches.open('shoppinglist')
          await cache.put(`/events/${listId}`, jsonResponse ).catch(e => console.log(e))
        }
      };
      eventSource.onerror = async (error) => {
        //use cache if we have access to it
        if(window.caches) {
          const data = await window.caches.match(`/events/${listId}`)
          const jsonData = await data?.json()
          const map = new Map(Object.entries(jsonData))
          setListItems(map);
        }
      }
      
      setListening(true);
    }
  }, [listening, listData, listId]);

  const checkListItem = (id: string) => {
    const newItems = listItems.map(item => item.id === id ? ({ ...item, checked: !item.checked }) : item)
    const updatedMap = listData.set(listId,newItems) 
    setListItems(updatedMap)
  }

  return checkListItem 
}

export default useListItems