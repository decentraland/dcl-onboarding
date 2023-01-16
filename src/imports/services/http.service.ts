import * as utils from "@dcl/ecs-scene-utils"
import { FlatFetchInit, FlatFetchResponse, signedFetch } from "@decentraland/SignedFetch";

type Headers = {
    'Content-Type': string,
    'Authorization'?: string
}

export class HttpService {
    private static instanceRef: HttpService;

    // Llamar singleton en el constructor
    private constructor() { }
    // Singleton Instance of the Object
    static instance(): HttpService {
        return this.instanceRef || (this.instanceRef = new this());
    }

    async signedGet(url: string, tokenID?: string): Promise<FlatFetchResponse>{
        const headers = this.createHeaders(tokenID);

        const init: FlatFetchInit = {
            headers: headers,
            method: "GET",
        }
        const response = await signedFetch(url, init)
        return response
    }

    async signedPost(url: string, payload: any, tokenID?: string): Promise<FlatFetchResponse>{
        const headers = this.createHeaders(tokenID);

        const init: FlatFetchInit = {
            headers: headers,
            method: "POST",
            body: JSON.stringify(payload)
        }
        const response = await signedFetch(url, init)
        return response
    }

    async signedPut(url: string, payload: any, tokenID?: string): Promise<FlatFetchResponse>{
        const headers = this.createHeaders(tokenID);

        const init: FlatFetchInit = {
            headers: headers,
            method: "PUT",
            body: JSON.stringify(payload)
        }
        const response = await signedFetch(url, init)
        return response
    }

    postRequest(url: string, payload: any, tokenID?: string): Promise<any> {
        let headers = this.createHeaders(tokenID);
        
        return utils.sendRequest(
            url,
            'POST',
            headers,
            payload
        )
    }
    putRequest(url: string, payload: any, tokenID?: string,): Promise<any> {
        let headers = this.createHeaders(tokenID);
        
        return utils.sendRequest(
            url,
            'PUT',
            headers,
            payload
        )
    }
    getRequest(url: string, tokenID?: string): Promise<any> {
        let headers = this.createHeaders(tokenID);
        
        return utils.sendRequest(
            url,
            'GET',
            headers
        )
    }
    async deleteRequest(url: string): Promise<any> {
        await utils.sendRequest(
            url,
            'DELETE'
        )
    }

    private createHeaders(tokenID?: string): Headers {

        if (tokenID) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenID}`
            }
        }

        return {
            'Content-Type': 'application/json'
        };
    }

}
