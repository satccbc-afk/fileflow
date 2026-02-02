import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isApiUpload = req.nextUrl.pathname.startsWith('/api/upload')

    if (isApiUpload && !isLoggedIn) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
})

export const config = {
    matcher: ["/api/upload/:path*"],
}
