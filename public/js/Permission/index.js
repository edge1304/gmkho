var arrFunction = []
var getOther = true
var arrSuperGroup = []
var arrGroup = []
getData()
function getData()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/permission?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            getOther:getOther
        },
        cache: false,
        success: function (data) {
            isLoading(false);
           
            if(getOther)
            {
                data.functions.forEach(func => {
                    arrFunction.push(func)
                });

                data.dataSuper.forEach(group => {
                    arrSuperGroup.push(group)
                });
                getOther = false
                
            }
            drawTable(data.dataGroups)
            
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function  drawTable(data) {
    $("#divTable").html(`
    <table id="dataTable" class="table table-hover">
        <thead>
        <tr>
            <th>STT</th>
            <th>Chức danh</th>
            <th>Bộ phận</th>
            <th>Chi tiết</th>
        </tr>
        </thead>
        <tbody id="tbodyTable"></tbody>
    </table>`)

  
    for(let i =0;i<data.length;i++)
    {
        for(let j =0;j<arrSuperGroup.length;j++)
        {
            if(arrSuperGroup[j]._id == data[i].id_super_group)
            {
                data[i].super_group_name = arrSuperGroup[j].employee_super_group_name
                break
            }
        }
        $("#tbodyTable").append(`
            <tr>
                <td class="center">${i+1}</td>
                <td>${data[i].employee_group_name}</td>
                <td>${data[i].super_group_name}</td>
                <td>
                    <button type="button" class="btn btn-success">Xem quyền</button>
                    <button type="button" class="btn btn-warning">Chỉ sửa</button>
                </td>
            </tr>
        `)
    }
    dataTable()
}