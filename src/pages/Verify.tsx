import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSendOtpMutation, useVerifyOTPMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


const Verify = () => {
    const location = useLocation();
    // const navigate = useNavigate();
    const [email] = useState(location.state);
    const [confirmed, setConfirmed] = useState(false);
    const [sendOtp] = useSendOtpMutation();
    const [verifyOTP] = useVerifyOTPMutation();
    const [timer, setTimer] = useState(12);

    // useEffect(() => {
    //    if(!email){
    //       navigate("/");
    //    }
    // },[email]);

    useEffect(() => {
      const timerId = setInterval(() => {
        if(!email || !confirmed){
           return;
        }
         setTimer((prev) => prev > 0 ? prev - 1 : 0);
         console.log("Check");
      }, 1000);

      return () => clearInterval(timerId);
    },[email, confirmed]);
    const FormSchema = z.object({
        pin: z.string().min(6, {
            message: "Your one-time password must be 6 characters.",
        }),
    })


        const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                pin: "",
            },
        })

         const onSubmit = async (data: z.infer<typeof FormSchema>) => {
             const toastId = toast.loading("Verifying OTP");
             const userInfo = {
                email,
                otp : data.pin
             }
             try{
               const res = await verifyOTP(userInfo).unwrap();
               if(res.success){
                  toast.success("OTP Verify", {id : toastId});
                  setConfirmed(true);
               }
             }catch(err){
               console.log(err);
             }
             console.log(data);
        };

        const handleConfirmed = async () =>{
            const toastId = toast.loading("Sending OTP");
            try{
                const res = await sendOtp({email : email}).unwrap();
                if(res.success){
                   toast.success("OTP Send", {id : toastId});
                   setConfirmed(true);
                }
            }catch(err){
              console.log(err);
            }
        }

        const handleSendOtp  = async () =>{
            setConfirmed(true);
            setTimer(120);
        }

        return (
            <div className="flex justify-center items-center min-h-screen">
                {confirmed ? <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                {/* Please enter the one-time password sent to your phone. */}
                                                <Button
                                                disabled={timer !== 0} 
                                                className={cn("p-0 m-0", {
                                                    "cursor-pointer" : timer === 0,
                                                    "text-gray-600" : timer !== 0 
                                                })}
                                                onClick={handleSendOtp} type="button" variant="link">Resent OTP : {" "}</Button>
                                                {timer}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                    </CardFooter>
                </Card> :  <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle>Verify Your Email Address</CardTitle>
                        <CardDescription>
                            We Will Send an OTP at {email}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col gap-2">
                        <Button onClick={handleConfirmed} className="w-full" type="submit">Submit</Button>
                    </CardFooter>
                </Card>}
                
               
            </div>
        );
    };

export default Verify;