---
title: "A Recent Discovery in React/JavaScript Development"
date: "2025-07-28"
tags: ["react", "javascript"]
excerpt: "In this post, I share a recent discovery and learning experience in React/JavaScript development."
image: "https://images.unsplash.com/photo-1695143634642-0e89a3312784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODM2OTN8MHwxfHNlYXJjaHwxfHxyZWNlbnQlMkNkaXNjb3Zlcnl8ZW58MHwwfHx8MTc1MzY5MzU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
---

In recent weeks, I've been working on a project in React/JavaScript that required me to use the `useEffect` hook to fetch data from an API and render it on the screen. However, I found myself struggling with understanding how to properly clean up this effect after it had run once.

After doing some research and reading through the documentation for `useEffect`, I discovered that there is a built-in function called `effectCleanup` that allows us to specify a function to be executed when the effect runs again, or when the component unmounts. This was exactly what I needed!

Here's an example of how I implemented this in my code:
```javascript
import { useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });

    // Clean up function to be executed when the effect runs again or when the component unmounts
    return () => {
      console.log('Effect cleaned up');
    };
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    );
  }
}
```
In this example, I'm using `useEffect` to fetch data from an API and store it in state. When the effect runs again or when the component unmounts, the cleanup function is executed, which logs "Effect cleaned up" to the console.

This was a valuable discovery for me because it allowed me to better understand how to properly clean up effects in React/JavaScript development. I also learned that there are built-in functions like `effectCleanup` that can make our lives easier when working with hooks.

In conclusion, this recent discovery has been helpful for me as a developer and I hope it will be useful for others who may be facing similar challenges. If you have any questions or would like to learn more about React/JavaScript development, feel free to reach out!