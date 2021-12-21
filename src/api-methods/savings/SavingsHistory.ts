import { PrivateAPIMethod } from "../APIMethod";
import { HistoricalDatapoint } from "../../data-model";

type Result = { result: HistoricalDatapoint[] }

function parse(values: any) {
    let object: Result = { result: [] }
    for (const value of values.listaValorPosicionGraficaDto) object.result.push(new HistoricalDatapoint(value));
    return object;
}

export class SavingsHistory extends PrivateAPIMethod {
    protected path = '/myinvestor-server/rest/protected/posiciones'
    protected method = 'POST'
    protected body = JSON.stringify({
        idCuentaValores: null,
        idCuentaPensiones: null,
        codigoIsin: null,
        filtroGraficaEnum: "YTD"
    });

    async request() { return (await this._request(parse as any) as Result).result }
}