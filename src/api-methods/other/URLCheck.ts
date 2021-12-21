import { PrivateAPIMethod } from "../APIMethod";

type Result = { result: boolean }

function parse(values: any) {
    return { result: values };
}

export class URLCheck extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/public/recursos/comprobar-cabeceras-url-pdf?url='
    protected method = 'GET'
    protected body = ''

    async request(url: URL) {
        this.path += encodeURIComponent(url.toString());
        return (await this._request(parse as any) as Result).result;
    }
}