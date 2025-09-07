import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import path from "path";

export default withAuth(

    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks:{
            authorized({req,token}){
                const {pathname} = req.nextUrl
                if(
                    pathname.startsWith('/login') || 
                    pathname === '/register' ||
                    pathname === '/login'
                )

                return true;

                if(pathname=== '/' || pathname.startsWith('/api/videos')){
                    return true;
                }

                return !!token
            },
        },
    }

)

export const config = {
    matcher: [
        "^\/(public/|favicon.ico|_next/static|_next/image)(\/.*)?$"
    ]
}