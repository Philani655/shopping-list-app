import { Item } from '../models/item'

let items: Item[] = [];

let currentId = 1

export const getItems = (): Item[] => {
    return items
}

export const getItemsById = (id: number): Item | undefined => {
    const item = items.find((item) => item.id === id);
    return item;
}

export const addItems = (name: string, quantity: number, purchasedStatus: string, price: number): Item => {
    const newItem: Item = {id: currentId++, name, quantity, purchasedStatus, price}
    items.push(newItem)
    return newItem
}

export const deleteItem = (id: number) => {
    items = items.filter((item) => item.id !== id);
}

export const updateItem = (id: number, updatedData: Partial<Item>): Item | undefined => {
    const item = items.findIndex((item) => item.id === id);

    if(item !== -1) {
        const updatedItem = {...items[item], ...updatedData};
        items[item] = updatedItem;
        return updatedItem;
    }
}



