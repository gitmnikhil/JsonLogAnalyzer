var fieldType = []
$.ajax({
    url: "/properties",
    dataType:"json",
    method:"GET"
}).done(function(data) {
    for(let i=0;i<data.length;i++){
        fieldType.push(data[i].name);
    }
});
var propertiesList = {}
function removeElement(event){
    event.parentNode.parentNode.removeChild(event.parentNode);
}
window.onload = function(){
    var socket = io();
    socket.on('connect', function(){
        console.log("Connection established")
    });
    socket.on('LogParsed', function(data){
        $("#notification").show();
        $("#notification").addClass("alert-info");
        $("#notification").removeClass("alert-danger");
        $("#notification").html("Log Parsing has been completed.");
        setTimeout(function(){
            $("#notification").hide();
        },60000);
    });
    socket.on('disconnect', function(){});
    $("#filePathButton").click(function(){
        var filePath = $('input[name="filePath"]').val();
        if(filePath == ""){
            alert("File Path not Entered");
            return;
        }
        LoadingCurtain(true);
        var domEle = $(this);
        $.ajax({
            url: "/processlogs",
            contentType:"application/json",
            dataType:"json",
            method:"POST",
            data:JSON.stringify({"path":filePath }),
            timeout: 9000000
        }).done(function( data ) {
            LoadingCurtain(false);
            $("#notification").show();
            $("#notification").removeClass("alert-info");
            $("#notification").addClass("alert-danger");
            $("#notification").html("Log Parsing in Progress. Please wait till it is completed.");
        });
    });
    $(".addfilter").click(function(){
        var options="";
        for(var i=0;i<fieldType.length;i++){
            options+="<option>" + fieldType[i] + "</option>";
        }
        $(".filterWrapper").append(`<div class="row filterInputRow">
            <div class="col">
                <select id="inputState" class="form-control filterInputProp">` + options + `
                </select>
            </div>
            <div class="col">
                <input type="text" class="form-control filterInputPropValue" name="fieldType" placeholder="Property Value">
            </div>
            <button type="button" onclick="javascript:removeElement(this)" class="btn btn-dark">Remove</button>
        </div>
        `)
    })
    $(".getFilteredData").click(function(){
        var properties = $(".filterInputRow");
        propertiesList = {};
        for(var i=0;i<properties.length;i++){
            var propName = properties.eq(i).find(".filterInputProp option:selected").text();
            var propValue = properties.eq(i).find(".filterInputPropValue").val();
            propertiesList[propName] = propValue;
        }
        getResult(0);
    })
    $(".prevResult").click(function(){
        var pageNo = parseInt($("#filteredResult").attr("data-page")) - 1
        getResult(pageNo)
    })
    $(".nextResult").click(function(){
        var pageNo = parseInt($("#filteredResult").attr("data-page")) + 1
        getResult(pageNo)
    })
    
    function getResult(pageNo){
        LoadingCurtain(true);
        $.ajax({
            url: "/getLogs",
            contentType:"application/json",
            dataType:"json",
            method:"POST",
            data:JSON.stringify({"propertiesList":propertiesList,page: pageNo}),
            timeout: 9000000
        }).done(function( data ) {
            $(".filteredResult").html(CreateTableFromJSON(data.logs,data.current));
            $("#filteredResult").attr("data-page",data.current);
            LoadingCurtain(false);
        });
    }

    function LoadingCurtain(show){
        if(show){
            $(".LoadingCurtain").show();
            $(".LoadingCurtain").width($(document).width());
            $(".LoadingCurtain").height($(document).height());

        }else{
            $(".LoadingCurtain").hide();
        }
    }
};

function CreateTableFromJSON(jsonData,pageno) {

    var col = [];
    for (var i = 0; i < jsonData.length; i++) {
        for (var key in jsonData[i].log) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    table.id = "filteredResult";
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.createTHead();                   // TABLE ROW.

    var th = document.createElement("th");      // TABLE HEADER.
    th.innerHTML = "Sno";
    tr.appendChild(th);

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < jsonData.length; i++) {

        tr = table.insertRow(-1);

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = ((pageno - 1) * 50) + i + 1;

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = jsonData[i].log[col[j]];
        }
    }
    return table;
}



