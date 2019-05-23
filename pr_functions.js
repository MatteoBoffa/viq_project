/**
 *  This JS file contains useful functions
 *  for VIQ project
 */

/**
 * Checks it the HTTP response code corresponds
 * to a successful request.
 * <ul>
 *    <li>{@code 200} : resource retrieved
 *    <li>{@code 304}: resource not modified  (this response is due to a conditional request)
 * </ul>
 *
 * @param {number} s - status code to be checked
 */
function okStatus(s){
    return [200,304].indexOf(s) >= 0;
}


/**
* Asynchronously loads a resource via an XML HTTP Request.
*
* @param {String} url - the URL of the resource to be loaded
* @param {Function} success - callback function
*/
function loadASync(url,success){
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === xhr.DONE)
            if(okStatus(xhr.status)){
                success(xhr.responseText);
            }else{
                throw "Async request failed (response: " + xhr.status + ":" + xhr.statusText + ") for URL " + url;
            }
    };
    xhr.send();
}

/**
 * Parses a string containing a CSV content and
 * produces an array of rows. Each row is an object
 * having as properties the columns of the CSV.
 *
 * @param {string} csv - the CSV content
 * @returns {Array} - the arrary of rows
 */
function csvParse(csv){
    'use strict';
    let csvRE=/(,|^|\n|\r|\r\n)[ \t]*(?:([^",\n\r]*)|"((?:[^"]*|"")*)")[ \t]*/g;
    let heads = [], rows = [];
    let row, col, line = -1;
    while(true){
        let match = csvRE.exec(csv);
        if(!match) break;
        if(match[1]!==','){
            if(row) rows.push(row);
            line++;  row=line&&{}; col=0;
        }
        let cell = match[2]||
            (match[3]||"").replace(/""/g,'"');
        if(line===0) heads.push(cell);
        else row[heads[col++]||"C"+col] = cell;
    }
    if(row)
        rows.push(row);
    return rows;
}

/**
 * Renders a table object into an HTML <table> element.
 *
 * Headers of the table are extracted from first
 * row's properties.
 *
 * @param {[]} data - object with table to be rendered
 * @returns {HTMLTableElement}
 */
function tableToHtmlElement(data){
    let res = document.createElement("table");
    let html ="<tr>";
    for(let h in data[0])
        if(data[0].hasOwnProperty(h))
            html+="<th>"+h+"</th>";
    html+="</tr>";
    for(let i=0; i<data.length; ++i){
        html+="<tr>";
        for(let f in data[i])
            if(data[i].hasOwnProperty(f))
                html+="<td>"+data[i][f]+"</td>";
        html+="</tr>";
    }
    html+="</table>";
    res.innerHTML = html;
    return res;
}


/**
 Parse an object array taking only the passed header

 @param {[]} data - data to parse
 @param {[]} headers - list of chosen header
 @return {[]} filteredData - array of filtered object
 */
function filterData(data,headers){

    let filteredData = [];
    let prp;
    for ( x in data ){
        let obj = {};
        for(y in headers){
            prp = headers[y];
            if(data[x].hasOwnProperty(prp)){

                obj[prp] = data[x][prp];
            }

        }
        filteredData.push(obj);
    }
    return filteredData;
}
/**
 Remove + and - in data

 @param {[]} data - data to modify
 @param {[]} headers - list of chosen header to remove + and -
 @return {[]} filteredData - array of filtered object
 */

function noPlusNoMinus(data,headers){

    let filteredData = [];
    let prp;
    let value;
    for ( x in data ){
        let obj = {};
        for(y in headers){
            prp = headers[y];
            if(data[x].hasOwnProperty(prp)){
                if(data[x][prp].indexOf("+") !== -1)
                    obj[prp] = data[x][prp].split("+")[0];
                else if(data[x][prp].indexOf("-") !== -1)
                    obj[prp] = data[x][prp].split("-")[0];
                else
                    obj[prp] = data[x][prp];

            }
        }
        filteredData.push(obj);
    }
    return filteredData;
}

function creaVettore(string,vettoreOggetti){
    var vettore = [];
    for(let i=0;i<filterData(vettoreOggetti,[string]).length;i++){
        vettore.push((filterData(vettoreOggetti,[string])[i])[string]);
    }
    return vettore;
}
/*
Il seguente frammento di codice serve a prendere il valore selezionato da un form
usando jquery

$(document).ready(function(){
  $("#btn1").click(function(){
    alert("Text: " + $("#Opzioni").val());
  });

  avendo così definito il form
  <form id="dati">
<select id="Opzioni">
<option value="Stats1">Stas</option>
<option value="Stats2">Stas2</option>
<option value="Stats3">Stas3</option>

</select></form>

<button id="btn1">Show Text</button>
 */