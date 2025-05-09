export default function getCookies() {
    const cookies = document.cookie.split('; ')
    const sbCookie = cookies.find(cookie => cookie.startsWith(process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME!))
    if (sbCookie) {
        return sbCookie.split('=')[1].replace("base64-", '')
    }
    return null
    }