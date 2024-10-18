'use client';
import io, { type Socket } from "socket.io-client";
import { env } from "@/lib/utils/configs/env";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { getErrorMessage } from "@/lib/utils/handler";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

// Initialize the socket connection once
const socket: Socket = io(env.SOCKET_URL);


const REASON_TYPE = [
    "normal_contact",
    "order_related",
    "delevery_related",
    "payment_related",
    "other",
] as const;


const validator = z.object({
    subject: z.string().min(1, 'Username is required'),
    reasonType: z.enum(REASON_TYPE) || 'normal_contact',
    description: z.string().min(3, 'Description should be more than 3 characters'),
})

type ticketTypes = z.infer<typeof validator>

interface Props {
    showDialoge: boolean
    setShowDialoge: (showDialoge: boolean) => void
}
export default function CreateTicketDialoge({ setShowDialoge, showDialoge }: Props) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const searchParams = useSearchParams()

    const ticketForm = useForm<ticketTypes>({
        defaultValues: undefined,
        resolver: zodResolver(validator),
    })

    const onSubmit = useMutation({
        mutationFn: async (val: ticketTypes) => {
            try {
                const res = await axios.post(`${env.BACKEND_URL}/create-ticket`, val);
                socket.emit("create_ticket", res.data.data);
                toast.success("Ticket created successfully");


                queryClient.invalidateQueries({
                    queryKey: ["tickets"],
                });

                ticketForm.reset();
                setShowDialoge(false);
                const newTicketId = res.data.data._id as string
                const parmas = new URLSearchParams(searchParams.toString())
                parmas.set('ticket', newTicketId)
                router.push(`/dash/chat?${parmas.toString()}`)

            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
    })
    return (
        <Dialog open={showDialoge} onOpenChange={setShowDialoge}>
            <DialogTrigger><Button className="rounded-md w-[200px] h-10">Create Ticket</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-5 border-b pb-2 w-fit">Create Ticket Room</DialogTitle>
                    <DialogDescription>
                        <form
                            onSubmit={ticketForm.handleSubmit((val) => {
                                onSubmit.mutate(val)
                            })}
                            className="w-full flex flex-col gap-5 items-center shadow border-2 min-h-[40vh] border-black/10 rounded-lg p-4">
                            <h3 className="text-xl font-bold my-10 border-b pb-2">Create A Room</h3>
                            <Input
                                label="Enter Subject"
                                type="text"
                                placeholder="Enter the Subject"
                                {...ticketForm.register('subject')}
                                error={ticketForm.formState.errors.subject?.message}
                            />
                            <Input
                                type="text"
                                label="Enter Description"
                                placeholder="Enter the Description"
                                {...ticketForm.register('description')}
                                error={ticketForm.formState.errors.description?.message}
                            />
                            <div className="w-full">
                                <Label>Select Reason</Label>
                                <Select
                                    value={ticketForm.watch('reasonType')}
                                    onValueChange={(val) => {
                                        ticketForm.setValue('reasonType', val as (typeof REASON_TYPE)[number]);
                                    }}
                                >
                                    <SelectTrigger className="!w-full h-10 ">
                                        <SelectValue placeholder="Select Reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REASON_TYPE.map((val) => (
                                            <SelectItem key={val} value={val}>
                                                {val}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>
                            <Button type="submit" className="w-full h-10 rounded-md text-sm font-semibold">Create Ticket</Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    );
}
