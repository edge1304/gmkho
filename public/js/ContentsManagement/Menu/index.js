getData()
var arrData = []
function getData() {
    isLoading()
   
    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val()
    $.ajax({
        type: 'GET',
        url: `../api/menu?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: null,
        cache: false,
        success: function (data) {
            isLoading(false);
            drawTable(data)
        },
        error: function (data) {
            isLoading(false);
            if (data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if (data != null && data.status != 503 && data.status != 502)
                info(data.responseText);

        }
    })
}

function drawTable(data)
{
    arrData = []
    $("#tbodyTable").empty()
    for(let i = 0 ; i<data.length ;i++)
    {
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td class="center">${i+1}</td>
                <td>${data[i].menu_name}</td>
                <td class="center"><button onclick="editMenu(${i})" class="btn btn-danger">Chi tiết</button></td>
            </tr>
        `)
    }
}

function editMenu(index)
{
    if(arrData[index].menu_type == "Category")
    {
        showPopup('menuBuildCaseApp')
    }
}