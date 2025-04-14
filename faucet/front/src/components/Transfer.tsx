import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import { useState } from "react";

declare global {
    interface Window {
        ethereum: any;
    }
}

export function Transfer() {
    const [tx, setTx] = useState<object | null>(null);
    const form = useForm({
        defaultValues: {
            from: "",
            to: "",
            amount: "0"
        }
    });


    const onSubmit = async (data: any) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(data.from);
            const tr = await signer.sendTransaction({
                to: data.to,
                value: ethers.parseEther(data.amount.toString())
            });
            const tx = await tr.wait();
            setTx(tx);
        alert("Transaction sent");

    }
    return (
        <div className="space-y mt-3">
            <h1 className="text-xl font-bold">Transfer</h1>
            <p>Transfer your money here</p>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}> 
                    <FormField control={form.control} name="from" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Origin Address</FormLabel>
                            <FormControl>
                                <Input placeholder="0x123456789..." {...field}/>
                            </FormControl>
                            <FormDescription>Origin of transaction</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="to" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination Address</FormLabel>
                            <FormControl>
                                <Input placeholder="0x123456789..." {...field}/>
                            </FormControl>
                            <FormDescription>Origin of transaction</FormDescription>
                            <FormMessage/>
                        </FormItem>
                        )}/>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input placeholder="0..." {...field}/>
                                </FormControl>
                                <FormDescription>Amount of transaction</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <Button type="submit">Transfer</Button>
                </form>
            </Form>
            { tx && <pre>{JSON.stringify(tx, null,4)}</pre> }
        </div>
    );
}
