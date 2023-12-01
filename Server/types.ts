import { task } from "./task"

export type stack = {
    counter: number,
    stack: task[]
}

export type user = {
    user: string | string[],
    key: string
}