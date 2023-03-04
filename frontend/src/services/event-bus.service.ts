export const SHOW_MSG = 'show-msg'

function createEventEmitter() {
    const listenersMap: any = {}
    return {
        on(evName: string, listener: Function) {
            listenersMap[evName] = (listenersMap[evName]) ? [...listenersMap[evName], listener] : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter((func: Function) => func !== listener)
            }
        },
        emit(evName: string, data: any) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach((listener: Function) => listener(data))
        }
    }
}

export const eventBus = createEventEmitter()

interface Data {
    txt: string,
    type: string
}

export function showUserMsg(msg: Data) {
    eventBus.emit('show-msg', msg)
}

export function showSuccessMsg(txt: string) {
    showUserMsg({ txt, type: 'success' })
}
export function showErrorMsg(txt: string) {
    showUserMsg({ txt, type: 'error' })
}
