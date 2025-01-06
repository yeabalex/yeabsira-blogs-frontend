import { InputOTPComponent } from "@/components/auth/otp";
import { Suspense } from "react";

export default function OTP(){
    return (
    <Suspense fallback={<div>Loading...</div>}>
        <InputOTPComponent/>
    </Suspense>
)
}