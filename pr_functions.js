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
    let csvRE=/(,|^|\r\n|\n|\r)[ \t]*(?:([^",\r?\n]*)|"((?:[^"]*|"")*)")[ \t]*/g;
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
    let html ="<thead>";
    for(let h in data[0])
        if(data[0].hasOwnProperty(h))
            html+="<th>"+h+"</th>";
    html+="</thead><tbody>";
    for(let i=0; i<data.length; ++i){
        html+="<tr>";
        for(let f in data[i])
            if(data[i].hasOwnProperty(f))
                html+="<td>"+data[i][f]+"</td>";
        html+="</tr>";
    }
    html+="</tbody></table>";
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
function selectCorrect(data,selection){

    let attackStats = ["Data", "Match", "Risultato", "Goal", "Expected Goals", "Tiri eseguiti"];
    let defensiveStats = ["Data", "Match", "Risultato", "Expected Goals", "Expected goals subiti", "Tiri subiti"];
    let attitudeStats = ["Data", "Match", "Risultato", "Palle intercettate", "Falli (Juve)", "Passaggi riusciti", "Possesso"];
    let usefulData;
    let noCom1;
    let noCom2;
    selection=parseInt(selection);
    switch (selection) {
        case 1 :
            usefulData = filterData(data,defensiveStats);
            noCom1="#commento11";
            noCom2="#commento21";
            break;
        default :
            usefulData = filterData(data,attitudeStats);
            noCom1="#commento12";
            noCom2="#commento22";
            break;
        case 3:
            usefulData = filterData(data,attackStats);
            noCom1="#commento13";
            noCom2="#commento23";
            break;
    }
    $(".comments").css({"display": "none"});
    $(".Grafici").css({"display":"block"});
    $(noCom1).css({"display" : "block"});
    $(noCom2).css({"display" : "block"});
    generaGrafici(usefulData);

}

function generaGrafici(UData) {
    //PRIMO GRAFICO
    let date = filterData(UData,["Data"]);
    let aData =[];
    let temp = [];
    for(let i=0;i<date.length;i++){
        temp = date[i].Data.split("/");

        aData.push(temp[2]+"-"+temp[0]+"-"+temp[1]);

    }
    console.log(aData);
    let axGA =[];
    date =  filterData(UData,["Expected goals subiti"]);
    for(let i=0;i<date.length;i++){
        axGA.push(+date[i]["Expected goals subiti"]);
    }
    date = filterData(UData,["Expected Goals"]);
    console.log(axGA);

    let AGa =[];
    for(let i=0;i<date.length;i++){
        AGa.push(+date[i]["Expected Goals"]);
    }
    console.log(AGa);


    //SECONDO GRAFICO
    let sA = filterData(UData,["Tiri subiti"]);


    let trace1=
        {
            x: aData,
            y: axGA,
            type: 'scatter',
            name: 'Expected goal against',
            line: { color:"orange"},
            mode: 'lines'
        };
    let trace2=
        {
            x: aData,
            y: AGa,
            type: 'scatter',
            name: 'xGoal',
            line : {
                color :"navy"
            },
            mode: 'lines',
        };
    let data = [trace1,trace2];

    let layout = {title:"Confronto xGa-Ga stagionale",
        shapes: [{
            type: 'line',
            x0: '2019-02-20',
            y0: 0,
            x1: '2019-02-20',
            //yref: 'paper',
            y1: 4,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
            }
        }]};
    Plotly.newPlot('grafic1', data, layout);
}
/**
 *  This will parse a delimited string into an array of
 *  arrays. The default delimiter is the comma, but this
 *  can be overriden in the second argument.
 *
 * @param {String} data - text to be parsed
 * @param {String} strDelimiter - delimiter chosen
 * @returns {[Array of obj]}
 *

 */
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    // Return the parsed data.
    return( arrData );
}
