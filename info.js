checarBin.addEventListener('click', () => {
  const infoBin = campoBin.value.trim();
  if (!infoBin) {
    Swal.fire({
      icon: 'error',
      title: 'Coloca un BIN!',
      text: 'El campo está vacio, necesitas escribir un BIN.'
    });
    return;
  }
  if (!/^[0-9]{6,8}$/.test(infoBin)) {
    Swal.fire({
      icon: 'error',
      title: 'Tu BIN está mal',
      text: 'El bin debe ser entre 6 y 8 digitos. No se permiten letras o simbolos.'
    });
    //Se limpia el input si no es un BIN valido//
    campoBin.value = '';
    return;
  }
  //Hacemos la petición al API de Binlist.net, solo se pueden 10 solicitudes por minuto//
  const link = `https://lookup.binlist.net/${infoBin}`;
  fetch(link).then(response => response.json()).then(data => {
    const emojiPais = obtenerEmoji(data.country.alpha2);
    const esPrepago = data.prepaid ? "Si" : "No";
    const ciudad = data.bank.city || "No disponible";
    document.getElementById('brand').innerHTML = data.brand;
    document.getElementById('bank').innerHTML = data.bank.name;
    document.getElementById('country').innerHTML = `${data.country.name} ${emojiPais}`;
    document.getElementById('type').innerHTML = data.type;
    document.getElementById('scheme').innerHTML = data.scheme;
    document.getElementById('prepaid').innerHTML = esPrepago;
    document.getElementById('currency').innerHTML = `$${data.country.currency}`;
    document.getElementById('city').innerHTML = ciudad;
  }).catch(error => {
    //Si la petición es incorrecta mostramos el error//
    resultados.innerHTML = `Hubo un problema: ${error.message}`;
  });
  //Limpiamos el campo al terminar//
  campoBin.value = '';
});
//Obtenemos el emoji del país//
function obtenerEmoji(countryCode) {
  const codigosNum = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codigosNum);
}

//Toggle dark mode nativo de Boootstrap 5 con localStorage//
const cambiarModo = document.querySelector('#dark-mode-toggle');
const temaActual = localStorage.getItem('theme');
if (temaActual) {
  document.documentElement.setAttribute('data-bs-theme', temaActual);
  if (temaActual === 'dark') {
    cambiarModo.checked = true;
  }
}
cambiarModo.addEventListener('change', alternarModos, false);

function alternarModos(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}