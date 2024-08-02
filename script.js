document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const nuevaTareaInput = document.getElementById("nueva-tarea");
  const fechaInicioInput = document.getElementById("fecha-inicio");
  const usuarioAsignadoInput = document.getElementById("usuario-asignado");
  const agregarTareaBtn = document.getElementById("agregar-tarea");
  const listaPendientes = document.getElementById("lista-pendientes");
  const listaEnProceso = document.getElementById("lista-en-proceso");
  const listaCompletadas = document.getElementById("lista-completadas");

  // Función para cargar tareas desde localStorage
  function cargarTareas() {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    listaPendientes.innerHTML = "";
    listaEnProceso.innerHTML = "";
    listaCompletadas.innerHTML = "";

    tareas.forEach((tarea) => {
      const li = document.createElement("li");
      li.classList.add(tarea.estado);
      li.innerHTML = `
                <div class="task-info">
                    <div class="date">Inicio: ${tarea.fechaInicio}</div>
                    <div class="user">Asignado a: ${tarea.usuario}</div>
                </div>
                ${tarea.texto}
            `;

      // Añadir tareas a la lista correspondiente según su estado
      if (tarea.estado === "completada") {
        listaCompletadas.appendChild(li);
      } else if (tarea.estado === "en-proceso") {
        const completarBtn = document.createElement("button");
        completarBtn.textContent = "Completar";
        completarBtn.classList.add("complete");
        completarBtn.addEventListener("click", () => {
          marcarComoCompletada(tarea.texto);
        });

        li.appendChild(completarBtn);
        listaEnProceso.appendChild(li);
      } else {
        const moverProcesoBtn = document.createElement("button");
        moverProcesoBtn.textContent = "Mover a Proceso";
        moverProcesoBtn.classList.add("complete");
        moverProcesoBtn.addEventListener("click", () => {
          moverAEnProceso(tarea.texto);
        });

        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.classList.add("remove");
        eliminarBtn.addEventListener("click", () => {
          eliminarTarea(tarea.texto);
        });

        li.appendChild(moverProcesoBtn);
        li.appendChild(eliminarBtn);
        listaPendientes.appendChild(li);
      }
    });
  }

  // Función para guardar tareas en localStorage
  function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  // Función para agregar una nueva tarea
  function agregarTarea() {
    const texto = nuevaTareaInput.value.trim();
    const fechaInicio = fechaInicioInput.value;
    const usuario = usuarioAsignadoInput.value.trim();

    if (texto === "" || fechaInicio === "" || usuario === "") return;

    const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas.push({ texto, fechaInicio, usuario, estado: "pendiente" });
    guardarTareas(tareas);
    nuevaTareaInput.value = "";
    fechaInicioInput.value = "";
    usuarioAsignadoInput.value = "";

    cargarTareas();
  }

  // Función para eliminar una tarea
  function eliminarTarea(texto) {
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas = tareas.filter((tarea) => tarea.texto !== texto);
    guardarTareas(tareas);
    cargarTareas();
  }

  // Función para marcar una tarea como completada
  function marcarComoCompletada(texto) {
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas.forEach((tarea) => {
      if (tarea.texto === texto) {
        tarea.estado = "completada";
      }
    });
    guardarTareas(tareas);
    cargarTareas();
  }

  // Función para mover una tarea a la columna de en proceso
  function moverAEnProceso(texto) {
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareas.forEach((tarea) => {
      if (tarea.texto === texto) {
        tarea.estado = "en-proceso";
      }
    });
    guardarTareas(tareas);
    cargarTareas();
  }

  // Evento para agregar tarea al hacer clic en el botón
  agregarTareaBtn.addEventListener("click", agregarTarea);

  // Cargar tareas al cargar la página
  cargarTareas();
});
