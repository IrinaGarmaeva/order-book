import { useEffect, useState } from "react";
// import { io } from 'socket.io-client';
import './orderBook.css';

const OrderBook = () => {
  const [orders, setOrders] = useState([]);

  const currencyPair = 'btcusd';
  const currencyList = currencyPair.toLocaleUpperCase().match(/.{1,3}/g);


  useEffect(() => {
    const ws = new WebSocket("wss://ws.bitstamp.net");

    const subscribe = {
      event: 'bts:subscribe',
      data: {
        channel: `order_book_${currencyPair}`
      }
    }

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setOrders(response.data)
      console.log(`Data received from server: ${response}`)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      ws.close();
    };
  }, [currencyPair])

  const {bids, asks} = orders

  const orderRows = (arr) =>
  arr &&
  arr.map((item, index) => (
    <tr key={index}>
      <td> {item[1]} </td>
      <td> {item[0]} </td>
    </tr>
  ));
const orderHead = (title) => (
  <thead>
    <tr>
      <th colSpan="2">{title}</th>
    </tr>
    <tr>
      <th>Amount ({currencyList[0]})</th>
      <th>Price ({currencyList[1]})</th>
    </tr>
  </thead>
);
return (
  <div className="order-container">
    <table>
      {orderHead('Bids')}
      <tbody>{orderRows(bids)}</tbody>
    </table>

    <table>
      {orderHead('Asks')}
      <tbody>{orderRows(asks)}</tbody>
    </table>
  </div>
);
}

export default OrderBook


    // const socket = io('/data');

    // socket.on('connect', () => {
    //   console.log(`Connected with id ${socket.id}`);
    //   socket.emit('bts:subscribe', { channel: `order_book_${currencyPair}`})
    // })

    // socket.on('data', (response) => {
    //   setOrders(response);
    //   console.log(`Data received from server: ${JSON.stringify(response)}`);
    // });

    // socket.on('disconnect', () => {
    //   console.log('Socket disconnected');
    // });

    // return () => {
    //   socket.disconnect();
    // };
