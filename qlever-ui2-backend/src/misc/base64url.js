export default function base64UrlDecode(base64url) {
    const base64 = base64url.replace(/_/g, '/').replace(/-/g, '+')
    return Buffer.from(base64, 'base64').toString('ascii')
}
