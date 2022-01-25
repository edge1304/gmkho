
getData()
var arrData = []
function getData()
{
    isLoading();
    $.ajax({
        type: 'get',
        url: `../api/fundbook?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: null,
        caches:false,

        success: function (data) {
            isLoading(false);
            drawTable(data)
        },
        error: function (data) {   
            errAjax(data) 
        }
    })
}

function confirmAdd()
{
    const fundbook_name = $("#add_fundbook_name").val().trim()
    const fundbook_type = $("input[name=add_fundbook_type]:checked").val()
    if(fundbook_name.length == 0){
        info("Tên sổ quỹ không được để trống")
        return
    }
    hidePopup('popupAdd')
    isLoading();

    $.ajax({
        type: 'post',
        url: `../api/fundbook?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            fundbook_name:fundbook_name,
            fundbook_type:fundbook_type
        },
        caches:false,

        success: function (data) {
            isLoading(false);
            success("Thêm mới thành công")
            getData()
        },
        error: function (data) {   
            errAjax(data) 
        }
    })

}


function drawTable(data)
{
    $("#divTable").html(`
    <table id="dataTable" class="table table-hover">
        <thead>
            <tr>
                <th>STT</th>
                <th>Tên sổ quỹ</th>
                <th>Loại</th>
                <th>Chỉnh sửa</th>
            </tr>
            </thead>
        <tbody id="tbodyTable"></tbody>
    </table>
    `)
    arrData = []
    for(let i =0;i<data.length;i++)
    {
        arrData.push(data[i])
        const fundbook_type = $(`input[name=add_fundbook_type][value=${data[i].fundbook_type}]`).closest('label').text().trim()
        $("#tbodyTable").append(`
            <tr>
                <td>${i+1}</td>
                <td class="center">${data[i].fundbook_name}</td>
                <td class="center">${fundbook_type}</td>
                <td class="center"><i onclick="showPopupEdit(${i})" class="fas fa-edit "></i></td>
            </tr>
        `)
    }
}

function showPopupEdit(index)
{
    $("#edit_fundbook_name").val(arrData[index].fundbook_name)
    $(`input[name=edit_fundbook_type][value=${arrData[index].fundbook_type}]`).prop("checked",true)

    $("#btnConfirmEdit").attr("onclick",`confirmEdit(${index})`)
    showPopup('popupEdit')
}

function confirmEdit(index)
{
    const fundbook_name = $("#edit_fundbook_name").val().trim()
    const fundbook_type = $("input[name=edit_fundbook_type]:checked").val()
    if(fundbook_name.length == 0){
        info("Tên sổ quỹ không được để trống")
        return
    }
    hidePopup('popupEdit')
    isLoading();

    $.ajax({
        type: 'put',
        url: `../api/fundbook`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            fundbook_name:fundbook_name,
            fundbook_type:fundbook_type,
            id_fundbook:arrData[index]._id
        },
        caches:false,

        success: function (data) {
            isLoading(false);
            success("Thêm mới thành công")
            getData()
        },
        error: function (data) {   
            errAjax(data) 
        }
    })
}