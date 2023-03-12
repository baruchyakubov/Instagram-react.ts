export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    randomPastTime,
    saveToStorage,
    loadFromStorage,
    loadFromSession,
    getDateFormat
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function debounce(fn: Function, ms = 300) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

function saveToStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key: string) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function loadFromSession(key: string) {
    const data = sessionStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function getDateFormat(timestamps: number | undefined): String | undefined {
    if (!timestamps) return
    const currDate = Date.now()
    let timePassed = currDate - timestamps
    timePassed /= 1000
    const SECONDS = 60, MINUTES = 3600, HOURS = 86400, YEAR = 365

    if (SECONDS >= timePassed)
        return timePassed + 's'
    else if (MINUTES >= timePassed)
        return Math.floor(timePassed / 60) + 'm'
    else if (HOURS >= timePassed)
        return Math.floor((timePassed / 60) / 60) + 'h'
    else if (Math.floor(timePassed / 60 / 60 / 24) <= YEAR)
        return Math.floor(timePassed / 60 / 60 / 24) + 'd'
    else
        return Math.floor((timePassed / 60 / 60 / 24) / 365) + 'y'
}
