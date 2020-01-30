const generateRandomString = (length, string) => {
    return Array(length)
        .fill(string)
        .map(value => {
            return value[Math.floor(Math.random() * value.length)];
        }).join('')
}
/**
 * Generate Random Password
 * 
 * @function generatePassword
 */
export const generatePassword = () => {
    let randPassword = generateRandomString(1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + generateRandomString(3, "abcdefghijklmnopqrstuvwxy") + generateRandomString(4, "0123456789")
    console.log(randPassword);
    return randPassword;
}

/**
 * Generate GUID
 * 
 * @function generateGUID
 */
export const generateGUID = () => {
    let GUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (res) => {
        let random = (new Date().getTime() + Math.random() * 16) % 16 | 0;
        return (res == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });
    return GUID;
}