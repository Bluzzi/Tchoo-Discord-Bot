import fetch, { type RequestInit } from "node-fetch";

export interface Response<T> {
    status: number;
    body: T;
}

export async function jsonFetch<T>(link: string, request: RequestInit|undefined = undefined): Promise<Response<T>> {
    const response = await fetch(link, request);

    return {
        status: response.status,
        body: await response.json() as any // ??
    }
}

export async function textFetch(link: string) : Promise<Response<string>> {
    const response = await fetch(link);

    return {
        status: response.status,
        body: await response.text()
    }
}