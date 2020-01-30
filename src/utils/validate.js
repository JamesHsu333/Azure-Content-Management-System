/**
 * @param {string} path
 * @return {Boolean}
 */

export const isExternal = (path) => {
    return /^(https?:|mailto:|tel:)/.test(path)
}