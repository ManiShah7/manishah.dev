---
title: "React useEffect Cleanup Patterns"
date: "2025-07-27"
tags: ["react", "javascript"]
excerpt: "Learn about cleanup patterns for React's useEffect hook"
image: "https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODM2OTN8MHwxfHNlYXJjaHwxfHxyZWFjdCUyQ3VzZWVmZmVjdHxlbnwwfDB8fHwxNzUzNjE1NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
---

React's useEffect hook is a powerful tool for managing side effects in components, but it can be easy to forget to clean up after yourself when you're done with them. In this post, we'll explore some common cleanup patterns for useEffect that I've found useful in my own projects.

## Cleaning Up Subscriptions and Unmounting

One of the most common use cases for useEffect is to manage subscriptions or unmounting of a component. For example, you might be using the `useState` hook to fetch data from an API, but when the user navigates away from the page, you don't want to keep the data in memory.

To handle this scenario, we can use a cleanup function that runs when the component unmounts. Here's an example:
```javascript
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);

    return () => {
      // clean up subscription
      console.log('unmounting');
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```
In this example, we're using the `useEffect` hook to fetch some data from an API and set it in state. When the component unmounts (i.e., when the user navigates away), the cleanup function is called, and we can do any necessary cleanup, like unsubscribing from a subscription or canceling a network request.

## Cleaning Up with useRef

Another common use case for useEffect is to manage subscriptions that are created within the component's body. For example, you might be using a third-party library that requires you to create a subscription in order to receive events or updates.

In this scenario, we can use `useRef` to store the subscription and clean it up when the component unmounts. Here's an example:
```javascript
import { useState, useEffect, useRef } from 'react';
import EventEmitter from './EventEmitter';

function MyComponent() {
  const [data, setData] = useState(null);
  const subscription = useRef();

  useEffect(() => {
    // create subscription
    subscription.current = EventEmitter.subscribe('data', data => {
      console.log(`Received new data: ${JSON.stringify(data)}`);
      setData(data);
    });

    return () => {
      // clean up subscription
      EventEmitter.unsubscribe(subscription.current);
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```
In this example, we're using `useRef` to store the subscription in a ref object, and then cleaning it up when the component unmounts. This ensures that we don't have any memory leaks or unexpected behavior when the user navigates away from the page.

## Cleaning Up with useLayoutEffect

In some cases, you may need to perform some cleanup actions in a different stage of the React component lifecycle than `useEffect`. For example, if you're using `useState` to fetch data and then rendering that data, you might want to clean up after yourself when the component unmounts.

To handle this scenario, we can use `useLayoutEffect`, which runs at a different stage of the lifecycle than `useEffect`. Here's an example:
```javascript
import { useState, useLayoutEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useLayoutEffect(() => {
    // fetch data and render it
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);

    return () => {
      // clean up subscription
      console.log('unmounting');
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}
```
In this example, we're using `useLayoutEffect` to fetch the data and then render it, but also cleaning up after ourselves when the component unmounts. This ensures that we don't have any memory leaks or unexpected behavior when the user navigates away from the page.

## Conclusion

In conclusion, cleaning up after yourself with React's useEffect hook is an important part of maintaining a healthy and scalable codebase. By using cleanup patterns like those outlined in this post, you can ensure that your components are properly unmounted when they're no longer needed, and avoid any unexpected behavior or memory leaks.