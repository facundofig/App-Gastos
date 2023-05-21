const ULRBASE = "https://dwallet.develotion.com/";

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("ion-nav");
const HOME = document.querySelector("#pantalla-home");
const REGISTRO = document.querySelector("#pantalla-registro");
const LOGIN = document.querySelector("#pantalla-login");
const AGREGARGASTO = document.querySelector("#pantalla-agregarGasto");
const AGREGARINGRESO = document.querySelector("#pantalla-agregarIngreso");
const MOVIMIENTOS = document.querySelector("#pantalla-movimientos");
const MONTOSTOTALES = document.querySelector("#pantalla-montosTotales");
const CAJEROSCERCANOS = document.querySelector("#pantalla-cajerosCercanos");

class Usuario {
    constructor(usu, pass, idDep, idCiu) {
        this.usuario = usu;
        this.password = pass;
        this.idDepartamento = idDep;
        this.idCiudad = idCiu;
    }
}

class LoginDTO {
    constructor(usu, pass) {
        this.usuario = usu;
        this.password = pass;
    }
}

class MovimientoDTO {
    constructor(idUsu, con, cat, tot, med, fec) {
        this.idUsuario = idUsu;
        this.concepto = con;
        this.categoria = cat;
        this.total = tot;
        this.medio = med;
        this.fecha = fec;
    }
}

class EliminarMovimientoDTO {
    constructor(id) {
        this.idMovimiento = id
    }
}