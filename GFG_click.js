var tre ; let AlertM1;
function GFG_click(onchange) { 
	document.getElementById('formhide').style.visibility='';
	document.getElementById('formhide').style.display='initial';
	document.getElementById('form1').style.display = 'initial' ; /*Mostrar*/
	document.getElementsByClassName('Peso')[0].style.display = "initial" ; /*Mostrar peso*/
	document.getElementById('form2').style.display = 'none' ; /*Oculta 3er radio*/
	document.getElementById('mlh').step = 1; /*Step normal*/
	document.getElementById('imginfo').style.visibility='';
    /*GFG var y prep*/
			    for (var i = 0; i < drogas.length; i++) {
    if (document.getElementById('Med').value == drogas[i]) {
	tre = new Array(eval(drogas[i]).cant, eval(drogas[i]).ml, eval(drogas[i]).cons, eval(drogas[i]).max, eval(drogas[i]).min, eval(drogas[i]).cant1, eval(drogas[i]).ml1, eval(drogas[i]).unit, eval(drogas[i]).tooltip, eval(drogas[i]).a1, eval(drogas[i]).a2, eval(drogas[i]).a3);
	    tref = new Array(eval(drogas[i]).cant2, eval(drogas[i]).ml2)
    }}
    /*Ocultar peso*/
if (document.getElementById('Med').value == String("Labetalol") || document.getElementById('Med').value == String("Morfina") || document.getElementById('Med').value == String ('Vasopresina') || document.getElementById('Med').value == String ('Nitroglicerina')) {
	document.getElementsByClassName('Peso')[0].style.display = "none"; 
}
/*Ocultar por no tener 2da prep*/
if (document.getElementById('Med').value == String("Pancuronio") ){
	document.getElementById('Form1').style.visibility = "hidden";
        document.getElementById('form1').style.display = 'none'; 
}
if (document.getElementById('Med').value == String("Noradrenalina") || document.getElementById('Med').value == String("Vasopresina") || document.getElementById('Med').value == String("Adrenalina") || document.getElementById('Med').value == String("Dobutamina") || document.getElementById('Med').value == String("Fentanilo") || document.getElementById('Med').value == String("Midazolam")  ){
	document.getElementById('form2').style.display = '' ; /*Mostrar 3er prep*/
}


    /*Arreglos final*/ 
 
 document.getElementById('Dosisf').value = '0.00 ' + tre[7]; /*Resetear Dosisf*/
 document.getElementById('prep').innerHTML = tre[9]; /*Prep texto*/
 document.getElementById('prep1').innerHTML = tre[10] ; /*Prep 1 texto*/
 document.getElementById('prep2').innerHTML = tre[11] ; /*Prep 2 texto*/
 document.getElementById('dosismm').innerHTML = "Dosis ("+ tre[4] + " " + tre[7] + " - " + tre[3] + " " + tre[7] + ")"; /*agregar rango de dosis min max*/
 document.getElementById('mlh').value = "0"; document.getElementsByClassName('ui-slider-handle')[1].style.left = '0%';/*Resetear mlh*/
 document.getElementById('prep').className = 'ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-on'; document.getElementById('prep1').className = 'ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off'/*Volver a prep 1*/
 document.getElementById('prep2').className = 'ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-radio-off'
document.getElementById("pesoIdeal").blur();
 document.getElementById('Form').checked = true; prep();
 }
 /*Cambiar step1*/
 function stepRange() {
	for (var i = 0; i < drogas.length; i++) {
	
	 if (document.getElementById('Med').value == drogas[i]) {
	    stepMax= eval(drogas[i]).stepMax;
	    stepLimit = Number(eval(drogas[i]).stepLimit);
	    stepMin1= eval(drogas[i]).stepMin1
	    if (document.getElementById("mlh").value > stepLimit) {
		    document.getElementById("mlh").step = stepMax;
    }
    if (document.getElementById('Med').value == String("Midazolam") || document.getElementById('Med').value == String("Fentanilo") ) {
		  if (document.getElementById('Form2').checked == true) {
			   
			  document.getElementById('mlh').step = stepMin1;
			  document.getElementById('mlh').value = (+document.getElementById('mlh').value).toFixed(1);
			  }}
    else { 
    document.getElementById("mlh").step = 1;
	    }
    }}}
 
 
 function calc() { /*Dosis */
 if ( document.getElementById('Form').checked == true ){
var dosis =tre[0] / tre[1] * tre[2] /Number(document.getElementById("Peso").value)*document.getElementById("mlh").value
 }
 else if ( document.getElementById('Form2').checked == true) {
 var dosis =tref[0] / tref[1] * tre[2] /Number(document.getElementById("Peso").value)*document.getElementById("mlh").value
 }
 else {
var dosis =tre[5] / tre[6] * tre[2] /Number(document.getElementById("Peso").value)*document.getElementById("mlh").value
 }
 /*Retirar peso*/
 if ( document.getElementById('Med').value == "Vasopresina" || document.getElementById('Med').value =="Nitroglicerina"|| document.getElementById('Med').value =="Morfina") {
 dosis = dosis*document.getElementById('Peso').value;
	 document.getElementById("Dosisf").value = Number(dosis).toFixed(2) + ' ' + tre[7]; /*Mostrar dosisf*/
 }
 else if ( document.getElementById('Med').value == "Labetalol") {
	 dosis = dosis*document.getElementById('Peso').value;
	 document.getElementById("Dosisf").value = Number(dosis).toFixed(2) + ' ' + tre[7]; /*Mostrar dosisf*/
 }
 else { document.getElementById("Dosisf").value = Number(dosis).toFixed(2) + ' ' + tre[7]; /*Mostrar dosisf*/}
 if (Number(dosis) > tre[3]) { /*Modificar color cuando supera dosis max*/
document.getElementById('Dosisf').style.color = '#e81414' ; }
else { document.getElementById('Dosisf').style.color = '#fff';}
 }
 
 function prep() { /*Maxmin*/
 if ( document.getElementById('Form').checked == true ){

 var cmm = tre[0] / tre[1] * tre[2] / Number(document.getElementById("Peso").value)
 }
 else if ( document.getElementById('Form2').checked == true) {
 var cmm = tref[0] / tref[1] * tre[2] / Number(document.getElementById("Peso").value)
 }
 else {
 var cmm = tre[5] / tre[6] * tre[2] /Number(document.getElementById("Peso").value)
 }
 if ( document.getElementById('Med').value == "Vasopresina" || document.getElementById('Med').value == "Labetalol" || document.getElementById('Med').value =="Nitroglicerina"|| document.getElementById('Med').value =="Morfina" ) {
 cmm = cmm*document.getElementById('Peso').value;
 }

 document.getElementById('mlh').max = Number(Number(tre[3]/cmm*1.1).toFixed(0)); /*Max input range*/
 
 var minId = Number(tre[4]/cmm);
 var maxId = Number (tre[3]/cmm).toFixed(0);
 
 if ( minId < "1.5" ) {
	 minId = minId.toFixed(1);
 }
 else {
	 minId = minId.toFixed(0);
 }
 document.getElementById("maxmin").value = 'Min: ' + minId + ' ml/h; Max: ' + maxId + ' ml/h ' ; /*setear maxmin*/
 /*document.getElementById("maxmin").value = 'Min: ' + Number(tre[4]/cmm).toFixed(0) + ' ml/h; Max: ' + Number (tre[3]/cmm).toFixed(0) + ' ml/h ' ; /*setear maxmin*/
 };

 function variarpeso() {
	 if (Number(document.getElementById('mlh').value) > Number(document.getElementById('mlh').max)) {
		 document.getElementById('mlh').value = document.getElementById('mlh').max; calc();
		document.getElementsByClassName('ui-slider-handle')[1].style.left = '100%' }
else { document.getElementsByClassName('ui-slider-handle')[1].style.left = document.getElementById('mlh').value/document.getElementById('mlh').max/1.1*100+'%';
}}

function calcPeso(onchange) {
	var sexo ;

	if (document.getElementById('fem1').checked)  {
				var sexo = 45.5 ;}
			else if (document.getElementById('male1').checked) {
			var sexo = 50;}

		document.getElementById('resultPeso').value = Number((document.getElementById('altura1').value - 152.4) * 0.91+ sexo ).toFixed(1)+' Kg';
}