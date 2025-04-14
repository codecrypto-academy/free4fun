import { useEffect, useState } from "react";

export default function Home() {
  
  type Data = {
    jsonrpc: string;
    id: number;
    result: string;
  };

  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    fetch("http://localhost:5556/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getBalance", params: ["0xBF5bd014f53Bb3066aF1E9390D9C5D1d05417fB7", "latest"], id: 1 })
    })
    .then(res => res.json())
    .then(setData)
    .catch(console.error);
  }, []);
  

  if (!data) { return <div>Loading...</div>;}
  
  return (
    <div>
    {Number(data.result)/10**18} ETH  
    </div>
  );
}