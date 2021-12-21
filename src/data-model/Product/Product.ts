import { APIResponse } from ".."
import { ProductBase } from "./ProductBase"

// /myinvestor-server/rest/protected/fondos/obtenerFondoByIsin
export class Product extends ProductBase {
    category: string // categoria

    urls: {
        key_investor_document: URL // urlKiid
        semiannual_report: URL // urlInformeSemestral
        statement: URL // urlMemoria
    }

    YTD: number // ytd
    Y1: number // yearUno
    Y3: number // yearTres
    Y5: number // yearCinco

    volatility: number // volatilidad
    volatilityY1: number // volatilidadYearUno
    volatilityY3: number // volatilidadYearTres
    volatilityY5: number // volatilidadYearCinco

    assets_stocks: number // activosAcciones / 100 (%)
    assets_liabilities: number // activosObligaciones / 100 (%)
    assets_cash: number // activosEfectivo / 100 (%)
    assets_other: number // activosOtro / 100 (%)

    my_investor_category: string // categoriaMyInvestor
    comission: number // porcentajeComision / 100 (%)
    initial_profitability: number // rentabilidadInicio / 100 (%)

    market: string // mercado

    currency_code: string // divisasDto.codigo
    currency_name: string // divisasDto.nombre
    currency_name_eng: string // divisasDto.nombreIngles
    currency_symbol: string // divisasDto.simbolo

    ter: number // ter / 100 (%)
    tracking_error_Y1: number // trackingErrorYearUno / 100 (%)
    product_type: string // tipoActivo
    geo_zone: string // zonaGeografica

    comissions: Comission[] // listaComisiones
    sectors: Sector[] // listaSectores

    fund_data: Fund // datosFondo
    latest_price_data: Price // ultimaCotizacion

    same_day_subscription_hour_limit: string // horaLimiteSuscripcionMismoDia
    profit_last_update: Date // fechaActualizacionRentabilidad Date(1639004400000)
    shares_floating_point_precision: number // numeroDecimalesParticipacion (i.e. 2)
    dividend_fund: boolean // fondoDistribucion
    socially_responsible: boolean // socialmenteResponsable
    op_mode: OpMode // modoOperativaPermitidaEnum

    constructor(values: APIResponse) {
        super(values);
        
        this.category = values.categoria
    
        this.urls = {
            key_investor_document: values.urlKiid,
            semiannual_report: values.urlInformeSemestral,
            statement: values.urlMemoria
        }
    
        this.YTD=values.ytd
        this.Y1=values.yearUno
        this.Y3=values.yearTres
        this.Y5=values.yearCinco
    
        this.volatility=values.volatilidad
        this.volatilityY1=values.volatilidadYearUno
        this.volatilityY3=values.volatilidadYearTres
        this.volatilityY5=values.volatilidadYearCinco
    
        this.assets_stocks=values.activosAcciones / 100
        this.assets_liabilities=values.activosObligaciones / 100
        this.assets_cash=values.activosEfectivo / 100
        this.assets_other=values.activosOtro / 100
    
        this.my_investor_category=values.categoriaMyInvestor
        this.comission=values.porcentajeComision / 100
        this.initial_profitability=values.rentabilidadInicio / 100
    
        this.market=values.mercado
    
        this.currency_code=values.divisasDto.codigo
        this.currency_name=values.divisasDto.nombre
        this.currency_name_eng=values.divisasDto.nombreIngles
        this.currency_symbol=values.divisasDto.simbolo
    
        this.ter=values.ter / 100
        this.tracking_error_Y1=values.trackingErrorYearUno / 100
        this.product_type=values.tipoActivo
        this.geo_zone=values.zonaGeografica
    
        this.comissions = values.listaComisiones.map(e => new Comission(e))
        this.sectors = values.listaSectores.map(e => new Sector(e))
    
        this.fund_data= new Fund(values.datosFondo)
        this.latest_price_data= new Price(values.ultimaCotizacion)
    
        this.same_day_subscription_hour_limit = values.horaLimiteSuscripcionMismoDia
        this.profit_last_update = new Date(values.fechaActualizacionRentabilidad)
        this.shares_floating_point_precision = values.numeroDecimalesParticipacion
        this.dividend_fund = values.fondoDistribucion
        this.socially_responsible = values.socialmenteResponsable
        this.op_mode= values.modoOperativaPermitidaEnum
    }

    static is(value: any): value is Product {
        throw 'NotImplemented'
    }
}

class Comission {
    name: string // nombre
    percentage: number // porcentaje / 100 (%)

    constructor(values: APIResponse) {
        this.name = values.nombre
        this.percentage = values.porcentaje / 100
    }
}
class Sector {
    name: string // nombre
    percentage: number // porcent / 100 (%)

    constructor(values: APIResponse) {
        this.name = values.nombre
        this.percentage = values.porcent / 100
    }
}

class Fund {
    managing_entity: string // entidadGestora

    constructor(values: APIResponse) {
        this.managing_entity = values.entidadGestora
    }
}

class Price {
    date: Date // fecha YYYY/MM/DD
    price: number // precio
    currency: string // divisa

    constructor(values: APIResponse) {
        let parts: number[] = values.fecha.split('/').map(Number)
        this.date = new Date(parts[0], parts[1], parts[2]) 
        this.price = values.precio
        this.currency = values.divisa
    }
}

export enum OpMode {
    CashAndShares = 'IMPORTE_Y_PARTICIPACIONES'
}