Inicio();

function Inicio() {
    Eventos();
    ArmarMenuOpciones();
}

function Eventos() {
    ROUTER.addEventListener("ionRouteDidChange", Navegar);

    document.querySelector("#btnRegistrar").addEventListener("click", RegistrarUsuario);
    document.querySelector("#slcRegistroDepartamentos").addEventListener("ionChange", CargarCiudades);
    document.querySelector("#btnIngresar").addEventListener("click", LoginUsuario);
    document.querySelector("#btnAgregarGasto").addEventListener("click", AgregarMovimiento);
    document.querySelector("#btnAgregarIngreso").addEventListener("click", AgregarMovimiento);
    document.querySelector("#btnFiltrarMovimientos").addEventListener("click", CargarMovimientosFiltrados);
}

function ArmarMenuOpciones() {
    document.querySelector("#menuOpciones").innerHTML = ``;
    let hayToken = localStorage.getItem('apikey');

    if(hayToken) {
        document.querySelector("#menuOpciones").innerHTML = `
        <ion-item href="/">Home</ion-item>
        <ion-item href="/agregarGasto">Agregar gasto</ion-item>
        <ion-item href="/agregarIngreso">Agregar ingreso</ion-item>
        <ion-item href="/movimientos">Movimientos</ion-item>
        <ion-item href="/montosTotales">Montos totales</ion-item>
        <ion-item href="/cajerosCercanos">Cajeros cercanos</ion-item>
        <ion-item onclick="CerrarSesion()">Cerrar sesión</ion-item>`
    } else {
        document.querySelector("#menuOpciones").innerHTML = `
        <ion-item href="/">Home</ion-item>
        <ion-item href="/registro">Registrarse</ion-item>
        <ion-item href="/login">Login</ion-item>`
    }
}

function Navegar(evt) {
    MENU.close();
    const ruta = evt.detail.to;
    if(ruta == "/") {
        MostrarHome();
    } else if(ruta == "/registro") {
        MostrarRegistro();
    } else if(ruta == "/login") {
        MostrarLogin();
    } else if(ruta == "/agregarGasto") {
        MostrarAgregarGasto();
    } else if(ruta == "/agregarIngreso") {
        MostrarAgregarIngreso();
    } else if(ruta == "/movimientos") {
        MostrarMovimientos();
    } else if(ruta == "/montosTotales") {
        MostrarMontosTotales();
    } else if(ruta == "/cajerosCercanos") {
        MostrarCajerosCercanos();
    }
}

function OcultarTodo() {
    REGISTRO.style.display = "none";
    LOGIN.style.display = "none";
    HOME.style.display = "none";
    AGREGARGASTO.style.display = "none";
    AGREGARINGRESO.style.display = "none";
    MOVIMIENTOS.style.display = "none";
    MONTOSTOTALES.style.display = "none";
    CAJEROSCERCANOS.style.display = "none";
}

function MostrarHome() {
    OcultarTodo();
    if(localStorage.getItem("apikey") == null) {
        document.querySelector("#contentHome").innerHTML = "Inicie sesión o registrese en la aplicación";
    } else {
        document.querySelector("#contentHome").innerHTML = "Bienvenido a la aplicación";
    }
    HOME.style.display = "block";
}

function MostrarRegistro() {
    OcultarTodo();
    CargarDepartamentos();
    REGISTRO.style.display = "block";
}

function MostrarLogin() {
    OcultarTodo();
    LOGIN.style.display = "block";
}

function MostrarAgregarGasto() {
    OcultarTodo();
    CargarRubros("Gasto");
    AGREGARGASTO.style.display = "block";
}

function MostrarAgregarIngreso() {
    OcultarTodo();
    CargarRubros("Ingreso");
    AGREGARINGRESO.style.display = "block";
}

function MostrarMovimientos() {
    OcultarTodo();
    CargarMovimientos();
    MOVIMIENTOS.style.display = "block";
}

function MostrarMontosTotales() {
    OcultarTodo();
    CargarMontosTotales();
    MONTOSTOTALES.style.display = "block";
}

function MostrarCajerosCercanos() {
    OcultarTodo();
    CargarMapa();
    CAJEROSCERCANOS.style.display = "block";
}

async function mensajeAlert(header) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }

/********************************REGISTRO EN LA APLICACIÓN*********************************/

function CargarDepartamentos() {
    fetch(`${ULRBASE}departamentos.php`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        for(let dep of data.departamentos) {
            document.querySelector("#slcRegistroDepartamentos").innerHTML += `<ion-select-option value="${dep.id}">${dep.nombre}</ion-select-option>`;
        }
    })
}

function CargarCiudades() {
    let idDepartamento = document.querySelector("#slcRegistroDepartamentos").value;
    fetch(`${ULRBASE}ciudades.php?idDepartamento=${idDepartamento}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        document.querySelector("#slcRegistroCiudades").innerHTML = ``
        for(let ciudad of data.ciudades) {
            document.querySelector("#slcRegistroCiudades").innerHTML += `<ion-select-option value="${ciudad.id}">${ciudad.nombre}</ion-select-option>`;
        }
    })
}

function RegistrarUsuario() {
    let nombreUsuario = document.querySelector("#txtRegistroUsuario").value;
    let password = document.querySelector("#txtRegistroPass").value;
    let idDepartamento = document.querySelector("#slcRegistroDepartamentos").value;
    let idCiudad = document.querySelector("#slcRegistroCiudades").value;

    let usuario = new Usuario(nombreUsuario, password, idDepartamento, idCiudad);

    fetch(`${ULRBASE}usuarios.php`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(usuario)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(data.codigo != 200) {
            document.querySelector("#msgRegistro").innerHTML = data.mensaje;
        } else {
            mensajeAlert("Registro exitoso!");
            NAV.push("page-login");
        }
    })
}

/********************************LOGIN EN LA APLICACIÓN*********************************/

function LoginUsuario() {
    let usuario = document.querySelector("#txtLoginUsuario").value;
    let password = document.querySelector("#txtLoginPass").value;

    let login = new LoginDTO(usuario, password);

    fetch(`${ULRBASE}login.php`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(login)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(data.codigo == 200) {
            localStorage.setItem("apikey", data.apiKey);
            localStorage.setItem("idUsuario", data.id);
            NAV.push("page-home");
            ArmarMenuOpciones();
        } else {
            document.querySelector("#msgLogin").innerHTML = data.mensaje;
        }
    })
}

/********************************LOGOUT*********************************/

function CerrarSesion() {
    localStorage.clear();
    MENU.close();
    NAV.push("page-home");
    ArmarMenuOpciones();
}

/********************************AGREGAR MOVIMIENTO*********************************/

function CargarRubros(tipo) {
    fetch(`${ULRBASE}rubros.php`, {
        method: "GET",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        document.querySelector(`#slcRubro${tipo}`).innerHTML = ``;
        
        for(let rubro of data.rubros) {
            if(rubro.tipo == tipo.toLowerCase()) {
                document.querySelector(`#slcRubro${tipo}`).innerHTML += `<ion-select-option value="${rubro.id}">${rubro.nombre}</ion-select-option>`;
            }
            
        }
    })
}

function AgregarMovimiento(evt) {
    let tipo;
    if(evt.srcElement.id == "btnAgregarGasto") {
        tipo = "Gasto";
    } else if(evt.srcElement.id == "btnAgregarIngreso") {
        tipo = "Ingreso";
    }

    let idUsuario = localStorage.getItem("idUsuario");
    let concepto = document.querySelector(`#txtConcepto${tipo}`).value;
    let categoria = document.querySelector(`#slcRubro${tipo}`).value;
    let total = document.querySelector(`#txtTotal${tipo}`).value;
    let medio = document.querySelector(`#slcMedio${tipo}`).value;
    let fecha = document.querySelector(`#date${tipo}`).value;

    let movimiento = new MovimientoDTO(idUsuario, concepto, categoria, total, medio, fecha);

    fetch(`${ULRBASE}movimientos.php`, {
        method: "POST",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        },
        body: JSON.stringify(movimiento)
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if(data.codigo == 200) {
            mensajeAlert("Movimiento ingresado con éxito!");
        }
    })
}

/********************************LISTADO DE MOVIMIENTOS*********************************/

function CargarMovimientos() {
    fetch(`${ULRBASE}movimientos.php?idUsuario=${localStorage.getItem("idUsuario")}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        document.querySelector("#contentMovimientos").innerHTML = ``;
        for(let movimiento of data.movimientos) {
            let tipoMovimiento;
            if(movimiento.categoria > 6) {
                tipoMovimiento = "Ingreso";
            } else {
                tipoMovimiento = "Gasto";
            }
            document.querySelector("#contentMovimientos").innerHTML += `<ion-item>
                                                                            <ion-label>${tipoMovimiento} - ${movimiento.concepto} - ${movimiento.fecha}</ion-label>
                                                                            <ion-button id="${movimiento.id}" class="btnEliminar">Eliminar</ion-button>
                                                                        </ion-item>`;
        }
        let botonesEliminar = document.querySelectorAll(".btnEliminar");
        for(let b of botonesEliminar) {
            b.addEventListener("click", EliminarMovimiento);
        }
    })
}

function EliminarMovimiento() {
    let movimiento = new EliminarMovimientoDTO(this.getAttribute("id"));

    fetch(`${ULRBASE}movimientos.php`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        },
        body: JSON.stringify(movimiento)
    })
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data)
        if(data.codigo == 200) {
            mensajeAlert(data.mensaje);
            CargarMovimientos();
        }
    })
}

/********************************FILTRO POR TIPO DE MOVIMIENTO*********************************/

function CargarMovimientosFiltrados() {
    fetch(`${ULRBASE}movimientos.php?idUsuario=${localStorage.getItem("idUsuario")}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        document.querySelector("#contentMovimientos").innerHTML = ``;
        let tipoSeleccionado = document.querySelector("#slcTipoMovimiento").value;
        for(let movimiento of data.movimientos) {
            if(tipoSeleccionado == "gasto" && movimiento.categoria <= 6) {
                document.querySelector("#contentMovimientos").innerHTML += `<ion-item>
                                                                                <ion-label>${movimiento.concepto} - ${movimiento.fecha}</ion-label>
                                                                                <ion-button id="${movimiento.id}" class="btnEliminar">Eliminar</ion-button>
                                                                            </ion-item>`;
            } else if(tipoSeleccionado == "ingreso" && movimiento.categoria > 6) {
                document.querySelector("#contentMovimientos").innerHTML += `<ion-item>
                                                                                <ion-label>${movimiento.concepto} - ${movimiento.fecha}</ion-label>
                                                                                <ion-button id="${movimiento.id}" class="btnEliminar">Eliminar</ion-button>
                                                                            </ion-item>`
            }
        }
        let botonesEliminar = document.querySelectorAll(".btnEliminar");
        for(let b of botonesEliminar) {
            b.addEventListener("click", EliminarMovimiento);
        }
    })
}

/********************************MONTOS TOTALES*********************************/

function CargarMontosTotales() {
    fetch(`${ULRBASE}movimientos.php?idUsuario=${localStorage.getItem("idUsuario")}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json", 
            "apikey": localStorage.getItem("apikey")
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        let totalIngresos = 0;
        let totalGastos = 0;
        for(let movimiento of data.movimientos) {
            if(movimiento.categoria > 6) {
                totalIngresos += movimiento.total;
            } else {
                totalGastos += movimiento.total;
            }
        }
        document.querySelector("#totalGastos").innerHTML = ``;
        document.querySelector("#totalGastos").innerHTML += `<ion-label>${totalGastos}</ion-label>`;

        document.querySelector("#totalIngresos").innerHTML = ``;
        document.querySelector("#totalIngresos").innerHTML += `<ion-label>${totalIngresos}</ion-label>`;

        document.querySelector("#saldoRestante").innerHTML = ``;
        document.querySelector("#saldoRestante").innerHTML += `<ion-label>${totalIngresos - totalGastos}</ion-label>`;
    })
}

/********************************CAJEROS CERCANOS*********************************/

function CargarMapa() {
    navigator.geolocation.getCurrentPosition(SetearMapaConCoordenadas);
    
}

function SetearMapaConCoordenadas(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    var map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    fetch(`${ULRBASE}cajeros.php`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data)
        for(let cajero of data.cajeros) {
            let marcador = L.marker([cajero.latitud, cajero.longitud]).addTo(map);

            let disponibilidad;
            let depositos;
            if(cajero.disponible == 1) {
                disponibilidad = "Cajero disponible";
            } else {
                disponibilidad = "Cajero NO disponible";
            }
            if(cajero.depositos == 1) {
                depositos = "Recibe depósitos";
            } else {
                depositos = "NO recibe depósitos";
            }
            marcador.bindPopup(`<p>${disponibilidad}</p> <p>${depositos}</p>`);
        }
    })
}