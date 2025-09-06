import { connectToDB } from "@/lib/db"
import  Video  from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        
        await connectToDB();
        const videos = await Video.find({}).sort({ createdAt: -1}).limit(10).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json({ error: 'No videos found' }, { status: 404 });
        }

        return NextResponse.json({videos},{status: 200});

    } catch (error) {
       return NextResponse.json({ error: 'Failed to get videos' }, { status: 500 })
    }
}