var arrData = [];

getData()

function getData()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/warehouse?`,
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
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function drawTable(data)
{
    $("#divTable").empty()
    $("#divTable").html(`
    <table id="dataTable" class="table table-hover">
        <thead>
        <tr>
            <th>STT</th>
            <th>Tên kho</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
        </tr>
        </thead>
        <tbody id="tbodyTable"></tbody>
    </table>`)
    arrData = []
    for(let i =0;i<data.length;i++)
    {
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td>${i+1}</td>
                <td>${data[i].warehouse_name}</td>
                <td>${data[i].warehouse_phone}</td>
                <td>${data[i].warehouse_address}</td>
                <td>${data[i].warehouse_status?"Đang hoạt động":"Đã dừng hoạt động"}</td>

                <td>
                    <button onclick="editWarehouse(${i})" class="btn btn-primary"><i class="mdi mdi-tooltip-edit">Chỉnh sửa</i></button>
                </td>
            </tr>
        `)
    }
    dataTable(null,false)
}

function editWarehouse(index)
{
    $("#editName").val(arrData[index].warehouse_name)
    $("#editPhone").val(arrData[index].warehouse_phone)
    $("#editAddress").val(arrData[index].warehouse_address)
    $(`input[type=radio][value=${arrData[index].warehouse_status}]`).prop("checked",true)
    $("#btnConfirmEdit").attr("onclick",`confirmEdit(${index})`)
    showPopup('popupEdit')
}



function confirmEdit(index)
{
    const warehouse_name = $("#editName").val().trim()
    const warehouse_phone = $("#editPhone").val().trim()
    const warehouse_address = $("#editAddress").val().trim()
    const warehouse_status = $(`input[type=radio]:checked`).val()
    if(warehouse_name.length == 0)
    {
        info("Tên kho không được để trống!")
        return ;
    }
   
    hidePopup('popupEdit')
    isLoading();
    $.ajax({
        type: 'put',
        url: `../api/warehouse`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            warehouse_name:warehouse_name,
            warehouse_phone:warehouse_phone,
            warehouse_address:warehouse_address,
            warehouse_status:warehouse_status,
            id_warehouse:arrData[index]._id
        },
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            getData()
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function confirmAdd()
{
    const warehouse_name = $("#addName").val().trim()
    const warehouse_phone = $("#addPhone").val().trim()
    const warehouse_address = $("#addAddress").val().trim()
    
    if(warehouse_name.length == 0)
    {
        info("Tên kho không được để trống!")
        return ;
    }
   
    hidePopup('popupAdd')
    isLoading();
    $.ajax({
        type: 'post',
        url: `../api/warehouse`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            warehouse_name:warehouse_name,
            warehouse_phone:warehouse_phone,
            warehouse_address:warehouse_address,
        },
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            getData()
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}