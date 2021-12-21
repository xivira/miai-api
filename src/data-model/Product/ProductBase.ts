import { APIResponse } from ".."

// /rest/protected/fondos/obtenerFondoByTiposProductoActivos
export class ProductBase {
    product_id: number // idFondo
    isin: string // codigoIsin
    name: string // nombre
    discontinued: boolean // descatalogado
    type: ProductType // tipoProductoEnum
    wihtout_rollback: boolean // sinRetrocesion ???

    constructor(values: APIResponse) {
        this.product_id = values.idFondo
        this.isin = values.codigoIsin
        this.name = values.nombre
        this.discontinued = values.descatalogado
        this.type = values.tipoProductoEnum
        this.wihtout_rollback = values.sinRetrocesion
    }
}

export enum ProductType {
    IndexFund = 'FONDOS_INDEXADOS',
    InvestmentFund = 'FONDOS_INVERSION'
}