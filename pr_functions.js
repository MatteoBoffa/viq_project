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

    let html ="<table><thead>";
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
    //res.innerHTML = html;
    return html;
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
/**
    Selects the correct alternative and calls print-graph functions
    @param {[data]} - array of data-objects
    @param {selection} - no of graph we want show
  */
function selectCorrect(data,selection){
    let noCom1;
    let noCom2;
    let noCom3;
    selection=parseInt(selection);
    if (selection === 1) {
        noCom1="#commento11";
        noCom2="#commento21";
        noCom3="#commento31";
        mostra(noCom1,noCom2,noCom3);
        generaGrafici(data);
    } else {
        noCom1="#commento12";
        noCom2="#commento22";
        noCom3="#commento32";
        mostra(noCom1,noCom2,noCom3);
        generaGrafico2(data);
    }
}
function mostra(noCom1,noCom2,noCom3){
    $(".comments").css({"display": "none"});
    $(".Grafici").css({"display":"block"});
    $(noCom1).css({"display" : "block"});
    $(noCom2).css({"display" : "block"});
    $(noCom3).css({"display" : "block"});
}

function median(numbers) {
    let median = 0, numsLen = numbers.length;
    numbers.sort();
    if (
        numsLen % 2 === 0 // is even
    ) {
        // average of two middle numbers
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { // is odd
        // middle number only
        median = numbers[(numsLen - 1) / 2];
    }
    return median;
}

function generaGrafici(UData) {
    //PRIMO GRAFICO
    let objArray = filterData(UData,["Data"]);
    let aData =[];
    let temp = [];
    for(let i=0;i<objArray.length;i++){
        temp = objArray[i].Data.split("/");
        aData.push(temp[2]+"-"+temp[0]+"-"+temp[1]);

    }
    let axGA =[];
    let txt = [];
    objArray =  filterData(UData,["Expected goals subiti","Match","Risultato"]);
    for(let i=0;i<objArray.length;i++){
        txt[i] = objArray[i]["Match"] + " " + objArray[i]["Risultato"];
        axGA.push(parseFloat(objArray[i]["Expected goals subiti"]));
    }
    objArray = filterData(UData,["Expected Goals"]);

    let AxG =[];
    for(let i=0;i<objArray.length;i++){
        AxG.push(parseFloat(objArray[i]["Expected Goals"]));
    }

    let somma=0;
    let somma3=0;
    let valoriPreAtletico = [];
    let valoriPostAtletico = [];
    let rapporto=[];
    for(let i=0;i<objArray.length;i++){
        rapporto.push(axGA[i]/AxG[i]);
        if(aData[i]<'2019-02-20'){
           somma+=rapporto[i];
           valoriPreAtletico.push(rapporto[i]);
        }else{
            somma3+=rapporto[i];
            valoriPostAtletico.push(rapporto[i]);
        }
    }
    document.getElementById("avg1").innerHTML=""+(this.median(valoriPreAtletico)).toPrecision(3);
    document.getElementById("avg2").innerHTML=""+(this.median(valoriPostAtletico)).toPrecision(3);

    //SECONDO GRAFICO

    objArray = filterData(UData,["Tiri subiti","Goal", "Goal subiti", "Risultato", "Match", "Expected goals subiti"]);
    let shootsAgWin = [];
    let shootsAgDraw = [];
    let shootsAgLost = [];
    let aMatchW = [];
    let aMatchD = [];
    let aMatchL = [];
    let axGAW = [];
    let axGAD = [];
    let axGAL = [];
    let goal = 0;
    let goalAg = 0;

    for(let i=0;i<objArray.length;i++){
        goal = parseInt(objArray[i]["Goal"]);
        goalAg = parseInt(objArray[i]["Goal subiti"]);

        if(goal>goalAg){
            shootsAgWin.push(parseInt(objArray[i]["Tiri subiti"]));
            aMatchW.push(objArray[i]["Match"]+" "+objArray[i]["Risultato"]);
            axGAW.push(parseFloat(objArray[i]["Expected goals subiti"]));
        }else if(goal===goalAg){
            shootsAgDraw.push(parseInt(objArray[i]["Tiri subiti"]));
            aMatchD.push(objArray[i]["Match"]+" "+objArray[i]["Risultato"]);
            axGAD.push(parseFloat(objArray[i]["Expected goals subiti"]));
        }else if(goal<goalAg){
            shootsAgLost.push(parseInt(objArray[i]["Tiri subiti"]));
            aMatchL.push(objArray[i]["Match"]+" "+objArray[i]["Risultato"]);
            axGAL.push(parseFloat(objArray[i]["Expected goals subiti"]));
        }
    }

    //GRAFICO 3

    let aMatchBAM = [];
    let xGagBeforeAM = [];
    let shootsAgBefAM = [];

    let aMatchAAM = [];
    let axGAAAM = [];
    let asAAAM = [];
    let Avg1;
    let somma1=0;
    let Avg2;
    let somma2=0;

    for(let i=0;i<objArray.length;i++){
        if(aData[i]<'2019-02-20'){
            shootsAgBefAM.push(+objArray[i]["Tiri subiti"]);
            aMatchBAM.push(objArray[i]["Match"]+" "+objArray[i]["Risultato"]);
            xGagBeforeAM.push(+objArray[i]["Expected goals subiti"]);
        }else{
            asAAAM.push(+objArray[i]["Tiri subiti"]);
            aMatchAAM.push(objArray[i]["Match"]+" "+objArray[i]["Risultato"]);
            axGAAAM.push(+objArray[i]["Expected goals subiti"]);
        }
       somma1=somma1+parseInt(objArray[i]["Tiri subiti"]);
        somma2=somma2+parseInt(objArray[i]["Expected goals subiti"]);
    }
    Avg1=somma1/objArray.length;
    Avg2=somma2/objArray.length;
    let data;
    //GRAFICO 1
        data = [
        {
            x:aData,
            y:rapporto,
            type: 'scatter',
            name: 'Rapporto xGA/xG',
            text : txt,
            line:{color:"orange"},
            mode: 'lines+markers'
        }
    ]

           let layout = {
            title:"Rapporto xGA/xG stagionale",
            shapes: [{
                type: 'line',
                x0: '2019-02-20',
                y0: 0,
                x1: '2019-02-20',
                //yref: 'paper',
                y1: 3.5,
                line: {
                    color: 'grey',
                    width: 1.5,
                    dash: 'dot'
                }
            }],
            xaxis: {
                title: 'Date giornate'
            },
            yaxis: {
                title: 'Rapporto xGA/xG'
            }
        };
    Plotly.newPlot('grafic1', data, layout);
    //GRAFICO 2
    let trace3={
        x: axGAW,
        y: shootsAgWin,
        type: 'scatter',
        mode: 'markers',
        text: aMatchW,
        marker:{
            size: 12,
            color: 'green'
        },
        name: 'Won'
    };
    let trace4={
        x: axGAD,
        y: shootsAgDraw,
        type: 'scatter',
        mode: 'markers',
        text: aMatchD,
        marker:{
            size: 12,
            color: 'yellow'
        },
        name: 'Draw'
    };
    let trace5={
        x: axGAL,
        y: shootsAgLost,
        type: 'scatter',
        mode: 'markers',
        text: aMatchL,
        marker:{
            size: 12,
            color: 'red'
        },
        name: 'Lost'
    };

    data=[trace3, trace4, trace5];
    layout = {title:"Analisi stagionale numero tiri ed occasioni concesse",
        shapes: [
            {
            type: 'line',
            x0: 0,
            y0: Avg1,
            x1: 2.4,
            //yref: 'paper',
            y1: Avg1,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
                }
            },{
                type: 'line',
                x0: this.median(axGA),
                y0: 0,
                x1: this.median(axGA),
                //yref: 'paper',
                y1: 30,
                line: {
                    color: 'grey',
                    width: 1.5,
                    dash: 'dot'
                }
            }
        ],
        xaxis: {
            title: 'Expected Goal against'
        },
        yaxis: {
            title: 'Tiri concessi'
        }
    };
    Plotly.newPlot('grafic2', data, layout);

    let trace6 ={
        x: xGagBeforeAM,
        y: shootsAgBefAM,
        type: 'scatter',
        mode: 'markers',
        text: aMatchBAM,
        marker:{
            size: 12,
            color: 'grey'
        },
        name: 'BeforeAtletico'
    };
    let trace7 = {
        x: axGAAAM,
        y: asAAAM,
        type: 'scatter',
        mode: 'markers',
        text: aMatchAAM,
        marker: {
            size: 12,
            color: 'navy'
        },
        name: 'AfterAtletico'
    };

    data=[trace6, trace7];
    layout = {title:"Analisi numero tiri ed occasioni concesse prima e dopo partita con l'Atletico",
        shapes: [{
            type: 'line',
            x0: 0,
            y0: Avg1,
            x1: 2.4,
            //yref: 'paper',
            y1: Avg1,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
                 }
             }, {
            type: 'line',
            x0: this.median(axGA),
            y0: 0,
            x1: this.median(axGA),
            //yref: 'paper',
            y1: 30,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
            }
        }
        ],
        xaxis: {
            title: 'Goal expected against'
        },
        yaxis: {
            title: 'Tiri concessi'
        }
    };
    Plotly.newPlot('grafic3', data, layout);
}

/**
 Generating graphs of the second page

 @param {[]} UData - array of object that contains data

 */
function generaGrafico2(UData){

    let date = filterData(UData,["Data"]);
    let aData =[];
    let temp = [];
    for(let i=0;i<date.length;i++){
        temp = date[i].Data.split("/");
        aData.push(temp[2]+"-"+temp[0]+"-"+temp[1]);
    }
    //SECONDO GRAFICO

    date = filterData(UData,["Tiri eseguiti","Goal","Goal subiti","Risultato", "Match", "Expected Goals"]);
    let aMatchW1 = [];
    let aMatchW2 = [];
    let aMatchL1 = [];
    let aMatchL2 = [];
    let goal2 = 0;
    let goalAg2 = 0;
    let shoots2 = 0;
    let xG2 = 0;
    let upGW = [];
    let upxGW = [];
    let upGDL = [];
    let upxGDL = [];
    let downGW = [];
    let downxGW = [];
    let downGDL = [];
    let downxGDL = [];
    let txt2;
    for(let i=0;i<date.length;i++){

        txt2 = date[i]["Match"]+" "+date[i]["Risultato"];
        goalAg2 = parseInt(date[i]["Goal subiti"]);
        goal2 = parseInt(date[i]["Goal"]);
        shoots2 = parseInt(date[i]["Tiri eseguiti"]);
        xG2 = parseFloat(date[i]["Expected Goals"]);
        if(Math.floor(xG2)<goal2){
            if(goal2>goalAg2) {
                upGW.push(goal2);
                upxGW.push(xG2);
                aMatchW1.push(txt2);
            }else{
                upGDL.push(goal2);
                upxGDL.push(xG2);
                aMatchL1.push(txt2);
            }
        }else{
            if(goal2>goalAg2) {
                downGW.push(goal2);
                downxGW.push(xG2);
                aMatchW2.push(txt2);
            }else{
                downGDL.push(goal2);
                downxGDL.push(xG2);
                aMatchL2.push(txt2);
            }
        }
    }

    //GRAFICO 3

    let aMatchBAM = [];
    let axGBAM = [];
    let asBAM = [];

    let avgGoalPre = 0.0;
    let avgGoalPost = 0.0;
    let no_match_pre_AM = 0;

    let aMatchAAM = [];
    let axGAAM = [];
    let asAAM = [];
    let Avg1;
    let somma1=0;
    let Avg2;
    let somma2=0;
    let somma3=0;
    let goal3 = 0;
    let goalAg3 = 0;
    let shoots3 = 0;
    let xG3 = 0;
    let txt3;
    for(let i=0;i<date.length;i++){
        txt3 = date[i]["Match"]+" "+date[i]["Risultato"];
        goalAg3 = parseInt(date[i]["Goal subiti"]);
        goal3 = parseInt(date[i]["Goal"]);

        shoots3 = parseInt(date[i]["Tiri eseguiti"]);
        xG3 = parseFloat(date[i]["Expected Goals"]);
        if(aData[i]<'2019-02-20'){
            asBAM.push(shoots3);
            aMatchBAM.push(txt3);
            axGBAM.push(xG3);
            avgGoalPre+=goal3;
            no_match_pre_AM++;
        }else{
            asAAM.push(shoots3);
            aMatchAAM.push(txt3);
            axGAAM.push(xG3);
            avgGoalPost+=goal3;
        }
        somma1=somma1+shoots3;
        somma2=somma2+xG3;
        somma3=somma3+goal3;
    }
    Avg1=somma1/date.length;
    Avg2=somma2/date.length;
    avgGoalPre/=no_match_pre_AM;
    avgGoalPost/=(date.length-no_match_pre_AM);
    let data;
    //GRAFICO 1
    let trace1 =
        {
            x: ["Pre partita Atletico"],
            y: [avgGoalPre],
            orientation : 'v',
            type: 'bar',
            name: 'Media goal pre-Atletico',
            width : [0.3],
            marker: {
                color:"orange"},
        };
    let trace2=
        {
            x: ["Post partita Atletico"],
            y: [avgGoalPost],
            type: 'bar',
            orientation : 'v',
            name: 'Media goal post-Atletico',
            width : [0.3],
            marker : {
                color :"navy",

            },
        };

    let layout = {
        title:"Confronto media goal prima e dopo la partita con l'Atletico Madrid"
        };

    Plotly.newPlot('grafic1', [trace1,trace2], layout);

    //GRAFICO 2
    let trace3={
        x: upxGW,
        y:upGW,
        type: 'scatter',
        mode: 'markers',
        text:aMatchW1,
        marker:{
            size: 12,
            color: 'green'
        },
        name: 'More Goals than xG (WON)'
    };
        let trace4={
        x: upxGDL,
        y:upGDL,
        type: 'scatter',
        mode: 'markers',
        text: aMatchL1,
        marker:{
            size: 12,
            color: 'orange'
        },
        name: 'More Goals than xG (DRAW-LOST)'
    };
    let trace5={
        x:downxGW,
        y: downGW,
        type: 'scatter',
        mode: 'markers',
        text: aMatchW2,
        marker:{
            size: 12,
            color: 'lime'
        },
        name: 'More xG than Goals (WON)'
    };
    let trace8={
        x:downxGDL,
        y: downGDL,
        type: 'scatter',
        mode: 'markers',
        text: aMatchL2,
        marker:{
            size: 12,
            color: 'red'
        },
        name: 'More xG than Goals (DRAW-LOST)'
    };

    data=[trace3,trace4,trace5,trace8];
    layout = {title:"Analisi stagionale goal ed xG",
        shapes: [
            {
                type: 'line',
                x0: 1,
                y0: 0,
                x1: 1,
                y1: 5,
                line: {
                    color: 'grey',
                    width: 1.5,
                    dash: 'dot'
                }
            },{
                type: 'line',
                x0: 2,
                y0: 0,
                x1: 2,
                y1: 5,
                line: {
                    color: 'grey',
                    width: 1.5,
                    dash: 'dot'
                }
            },{
                type: 'line',
                x0: 3,
                y0: 0,
                x1: 3,
                y1: 5,
                line: {
                    color: 'grey',
                    width: 1.5,
                    dash: 'dot'
                }
            }
        ],
        xaxis: {
            title: 'xG'
        },
        yaxis: {
            title: 'Goal',
            range: [0,5]
        }
    };
    Plotly.newPlot('grafic2', data, layout);

    let trace6 ={
        x: axGBAM,
        y: asBAM,
        type: 'scatter',
        mode: 'markers',
        text: aMatchBAM,
        marker:{
            size: 12,
            color: 'grey'
        },
        name: 'Before Atletico'
    };
    let trace7 = {
        x: axGAAM,
        y: asAAM,
        type: 'scatter',
        mode: 'markers',
        text: aMatchAAM,
        marker: {
            size: 12,
            color: 'navy'
        },
        name: 'After Atletico'
    };

    data=[trace6, trace7];
    layout = {title:"Analisi numero tiri ed occasioni create prima e dopo partita con l'Atletico",
        shapes: [{
            type: 'line',
            x0: 0,
            y0: Avg1,
            x1: 4,
            y1: Avg1,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
            }
        }, {
            type: 'line',
            x0: Avg2,
            y0: 0,
            x1: Avg2,
            y1: 30,
            line: {
                color: 'grey',
                width: 1.5,
                dash: 'dot'
            }
        }
        ],
        xaxis: {
            title: 'xG'
        },
        yaxis: {
            title: 'Shoots'
        }
    };
    Plotly.newPlot('grafic3', data, layout);
}

function generaGraficopage1() {
    let data;
    //Async request : defining "success" function
    loadASync("serie_a_stats.csv", csv => {
        //CREAZIONE TABELLA
        data = csvParse(csv);
        console.log(data);
        let columns = ["N", "Team", "M", "W", "D", "L", "G", "GA", "PTS", "xG", "xGA", "xPTS"];

        document.getElementById("myTable").innerHTML=(tableToHtmlElement(noPlusNoMinus(data, columns)));

        //CREAZIONE GRAFICO 1
        let nomeSquadre = [];
        for (let i = 0; i < filterData(data, ['Team']).length; i++) {
            nomeSquadre.push((filterData(data, ['Team'])[i]).Team);
        }
        let punti = [];
        for (let i = 0; i < filterData(data, ['PTS']).length; i++) {
            punti.push((filterData(data, ['PTS'])[i]).PTS);
        }
        let expectedPoints = [];
        for (let i = 0; i < noPlusNoMinus(data, ['xPTS']).length; i++) {
            expectedPoints.push((noPlusNoMinus(data, ['xPTS'])[i]).xPTS);
        }
        var trace1 =
            {
                x: nomeSquadre,
                y: punti,
                type: 'bar',
                name: 'Punti',
                marker: {color: "red"}
            };
        var trace2 =
            {
                x: nomeSquadre,
                y: expectedPoints,
                type: 'bar',
                name: 'ExpectedPoints',
                marker: {color: "navy"}
            };
        var datiGrafico = [trace1, trace2];
        var layout = {
            barmode: 'group',
            title: "Confronto punti-expected points per ciascuna squadra",
            margin: {t: 50, l: 60, r: 30, b: 80}
        };
        Plotly.newPlot('myDiv', datiGrafico, layout);

        //GRAFICO 2

        let datiSecondo = noPlusNoMinus(data, ['Team', 'xPTS']);
        datiSecondo.sort((a, b) => b.xPTS - a.xPTS);

        let nomeSquadre1 = [];
        for (let i = 0; i < filterData(datiSecondo, ['Team']).length; i++) {
            nomeSquadre1.push((filterData(datiSecondo, ['Team'])[i]).Team);
        }
        expectedPoints = [];
        for (let i = 0; i < filterData(datiSecondo, ['xPTS']).length; i++) {
            expectedPoints.push((filterData(datiSecondo, ['xPTS'])[i]).xPTS);
        }
        var data2 = [
            {
                x: expectedPoints,
                y: nomeSquadre1,
                orientation: 'h',
                type: 'bar',
                marker: {color: "orange"}
            }
        ]
        var layout = {
            margin: {t: 70, l: 150, r: 30, b: 30},
            title: "Classifica serie A (expected points)"
        };
        Plotly.newPlot('myDiv2', data2, layout);

        //GRAFICO 3
        console.log(expectedPoints);
        console.log(nomeSquadre);
        var data3 = [
            {
                x: punti,
                y: nomeSquadre,
                orientation: 'h',
                type: 'bar',
                marker: {color: "navy"}
            }
        ]
        var layout = {
            margin: {t: 70, l: 150, r: 30, b: 30},
            title: "Classifica serie A (real points)"
        };
        Plotly.newPlot('myDiv3', data3, layout);
    })
}