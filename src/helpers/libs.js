const helpers = {}

helpers.randomNumber = () => {
    const possible = 'abcdefghijklmnopqrstuvwxy0123456789'
    let nombreDigito = ''
    for (let i = 0; i < 6; i++) {
        nombreDigito += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return nombreDigito
}

module.exports = helpers;