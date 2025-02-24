import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
    try {
        const { email, subject, message } = await req.json();
        if (!email || !subject || !message) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const result = await sendEmail(email, subject, message);
        return NextResponse.json(result, { status: result.success ? 200 : 500 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
