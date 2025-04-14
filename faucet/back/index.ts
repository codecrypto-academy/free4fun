import express from 'express';
import { Request, Response } from 'express';
import { ethers } from 'ethers';
import  fs  from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
//Load environment variables

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = 3333;

app.get('/api/balanceEthers/:address', async (req: Request, res: Response) => {
    const address = req.params.address;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const balance = await provider.getBalance(address);
    res.json({ address, balance: Number(balance) /10**18, date: new Date().toISOString() });
});

app.get('/api/faucet/:address/:amount', async (req: Request, res: Response) => {
    const { address, amount } = req.params;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const route = process.env.KEYSTORE_FILE;
    if (!route) {
        res.status(500).json({ error: "KEYSTORE_FILE is not defined" });
        return;
    }
    const routeData = fs.readFileSync(route, "utf-8");
    const rpcPwd = process.env.RPC_PWD;
    if (!rpcPwd) {
        res.status(500).json({ error: "RPC_PWD is not defined" });
        return;
    }
    const wallet = await ethers.Wallet.fromEncryptedJson(routeData, rpcPwd);
    const walletConnected = wallet.connect(provider);
    const tx = await walletConnected.sendTransaction({ to : address, value: ethers.parseEther(amount) });
    await tx.wait();
    res.json({ address, amount, date: new Date().toISOString() });
});

    
app.get('/api/balance/:address', async (req: Request, res: Response) => {
    const address = req.params.address;
    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) {
        res.status(500).json({ error: "RPC_URL is not defined" });
        return;
    }
    const ret = await fetch(rpcUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getBalance", params: [address, "latest"], id: 1 })
    })
    const data: any  = await ret.json();
    res.json( { address, balance: Number(data.result)/10**18, date: new Date().toISOString()} );
}
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});