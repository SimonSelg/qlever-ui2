import { useEffect, useState, useCallback, useRef } from 'react'

export const createWouterHook = history => ({ base = '' } = {}) => {
    const [path, update] = useState(
        currentPathname(base, history.location.pathname)
    )
    const prevPath = useRef(path)

    useEffect(() => {
        const updateIfNessecary = location => {
            const pathname = currentPathname(base, location.pathname)
            if (prevPath.current === pathname) return
            update((prevPath.current = pathname))
        }
        updateIfNessecary(history.location)
        return history.listen(updateIfNessecary)
    }, [base]) // eslint-disable-line react-hooks/exhaustive-deps

    const navigate = useCallback(
        (to, replace) => history[replace ? 'replace' : 'push'](base + to),
        [base] // eslint-disable-line react-hooks/exhaustive-deps
    )
    return [path, navigate]
}

const currentPathname = (base, path) =>
    !path.indexOf(base) ? path.slice(base.length) || '/' : path
