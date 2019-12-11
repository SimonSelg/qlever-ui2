function isObject(item) {
    return typeof item === 'object' && item !== null
}

// walk over every node in object and call fn it
// supports objects and arrays
export function walkObject(root, fn) {
    function walk(obj) {
        // go through all keys and their corresponding values
        Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (Array.isArray(value)) {
                // Value is an array, call walk on each item in the array
                value.forEach((el, key) => {
                    if (isObject(el)) {
                        walk(el)
                    } else {
                        fn(value, key)
                    }
                })
            } else if (isObject(value)) {
                // Value is an object, walk the keys of the object
                walk(value)
            } else {
                // We've reached a leaf node, call fn on the leaf with the location
                fn(obj, key)
            }
        })
    }
    walk(root)
}
