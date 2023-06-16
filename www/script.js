const taskList = [];
const taskList2 = document.getElementById("task-list");
let startX;
let timer;

function create_li (task) {
  const taskItem = document.createElement("li");
  taskItem.id = task.id;
  taskItem.textContent = task.title;
  taskList2.appendChild(taskItem);
  if(task.done === true){
    taskItem.style.backgroundColor = "green";
  }else{
    taskItem.style.backgroundColor = "red";
  }
  // Agregar un listener para el evento touchstart
  taskItem.addEventListener('touchstart', function(e) {
    // Obtener la posición inicial del dedo
    startX = e.touches[0].pageX;
    // Iniciar temporizador
    timer = setTimeout(function() {
      // Llamar a la función toggleDone si el dedo se mantiene pulsado durante 2 segundos
      toggleDone(e);
    }, 2000);
  });
  // Agregar un listener para el evento touchmove
  taskItem.addEventListener('touchmove', function(e) {
    // Evitar el comportamiento predeterminado de desplazamiento en la pantalla
    e.preventDefault();
    // Cancelar temporizador si el dedo se mueve
    clearTimeout(timer);
  });
  
  // Agregar un listener para el evento touchend
  taskItem.addEventListener('touchend', function(e) {
    // Obtener la posición final del dedo
    let endX = e.changedTouches[0].pageX;
    let distance = endX - startX;
    // Si la posición final del dedo está a la derecha de la posición inicial
    if (endX > startX && distance >= 50) {
     // Eliminar de la lista
     remove();
    }
    // Cancelar temporizador si el dedo se levanta antes de los 2 segundos
    clearTimeout(timer);
  });
}

const loadTasks = async () => {
  const response = await fetch("/tasks/get");
  const f_json = await response.json();
  console.log(f_json);
  //Recorrer las tareas y crear un elemento HTML para cada una y añadirlo al array
  f_json.forEach(task => {
    taskList.push(task);
    create_li(task);
  });
  //Mostrar popup
  Swal.fire({
    icon: 'success',
    title: '¡Hola Marcos! Has añadido varias tareas',
    showConfirmButton: false,
    timer: 2000
  }) 
  // Hacer vibrar el dispositivo
  navigator.vibrate(300);
  console.log(taskList);
}

const add = () => {
  const taskList3 = document.getElementById("task-list");
  const input = document.getElementById("task-name");
  const title = input.value.trim();
  if (title.length > 0) {
    const id = taskList.length + 1;
    const task = { id, title, done: false };
    taskList.push(task);
    input.value = '';
    create_li(task);
    //Mostrar popup
    Swal.fire({
      icon: 'success',
      title: 'Has añadido una tarea.',
      showConfirmButton: false,
      timer: 2000
    })
    // Hacer vibrar el dispositivo
    navigator.vibrate(300);
    console.log(taskList);
  }
}

const remove = () => {
  // Obtener el elemento li correspondiente al evento
  const taskItem = event.target;
  // Obtener el id de la tarea
  const taskId = taskItem.id;
  // Eliminar la tarea de la lista taskList
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      taskList.splice(i, 1);
      break;
    }
  }
  // Eliminar el elemento li correspondiente
  taskItem.parentNode.removeChild(taskItem);
  //Mostrar popup de éxito
  Swal.fire({
    icon: 'warning',
    title: 'Has eliminado una tarea.',
    showConfirmButton: false,
    timer: 2000,
  })
  // Hacer vibrar el dispositivo
  navigator.vibrate(300);
}


const toggleDone = (event) => {
  // Obtener el elemento li correspondiente al evento
  const taskItem = event.target;
  // Obtener el id de la tarea
  const taskId = taskItem.id;
  // Cambiar el estado de done de la tarea correspondiente en taskList
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      taskList[i].done = !taskList[i].done;
      break;
    }
  }
  // Cambiar el color de fondo del elemento li correspondiente
  if (taskItem.style.backgroundColor === "green") {
    taskItem.style.backgroundColor = "red";
    //Mostrar popup
    Swal.fire({
      icon: 'warning',
      title: 'Has reiniciado una tarea.',
      showConfirmButton: false,
      timer: 2000,
    })
    // Hacer vibrar el dispositivo
    navigator.vibrate(300);
  } else {
    taskItem.style.backgroundColor = "green";
    //Mostrar popup de éxito
    Swal.fire({
      icon: 'success',
      title: 'Has completado una tarea.',
      showConfirmButton: false,
      timer: 2000,
    })
    // Hacer vibrar el dispositivo
    navigator.vibrate(300);
  }
  
}
const addButton = document.querySelector("#fab-add");

loadTasks(); //Mostrar tareas
addButton.addEventListener("click", add); //Añadir tarea