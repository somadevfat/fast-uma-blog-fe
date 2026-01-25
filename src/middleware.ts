import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;

    // Protect /admin routes (except /admin/login)
    if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
        const authToken = cookies.get("auth_token");

        if (!authToken) {
            return redirect("/admin/login");
        }
    }

    return next();
});
