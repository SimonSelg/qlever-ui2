export default function encode(text) {
    return btoa(text)
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
}
