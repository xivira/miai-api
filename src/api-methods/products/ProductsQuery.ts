import { ProductBase } from "../../data-model";
import { PrivateAPIMethod } from "../APIMethod";

type Result = { result: ProductBase[] }

function parse(values: any) {
    let object: Result = { result: [] }
    for (const value of values) object.result.push(new ProductBase(value));
    return object;
}

export class ProductsQuery extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/fondos/obtenerFondoByTiposProductoActivos?term='
    protected method = 'POST'
    protected body = JSON.stringify([
        "FONDOS_INDEXADOS",
        "FONDOS_INVERSION" // Say "no!" to managed funds
    ])

    async request(search_terms?: string) {
         this.path = `${this.path}${encodeURIComponent(search_terms || '')}`
        return (await this._request(parse as any) as Result).result;
    }
}