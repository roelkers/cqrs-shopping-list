import { useRecoilState, useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { listDataState, listIdState } from "./atoms";
import { createEventSource } from "./client";
import { listItemsState } from "./selectors";
import { IShoppingItem } from "./interfaces";

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
        const map = new Map(Object.entries(parsedData)) as Map<string, IShoppingItem[]>
        setListItems(map);
        //update cache if we have access to it
        if(window.caches) {
          const cache = await window.caches.open('shoppinglist')
          await cache.put(`/events/${listId}`, jsonResponse ).catch(e => console.log(e))
        }
      };
      eventSource.onerror = async (error) => {
        //use cache if we have access to it
        if(window.caches && !listItems) {
          const data = await window.caches.match(`/events/${listId}`)
          const jsonData = await data?.json()
          const map = new Map(Object.entries(jsonData)) as Map<string, IShoppingItem[]>
          setListItems(map);
        }
      }
      
      setListening(true);
    }
  }, [listening, listItems, listId]);

  const checkListItem = (id: string) => {
    const newItems = listItems.map(item => item.id === id ? ({ ...item, checked: !item.checked }) : item)
    const newMap = new Map(listData)
    newMap.set(listId,newItems) 
    setListItems(newMap)
  }

  return checkListItem 
}

export default useListItems