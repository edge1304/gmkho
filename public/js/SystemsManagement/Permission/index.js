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
        url: `../api/permission/groupAndFunction?`,
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
                drawTablePermission()

                data.dataSuper.forEach(group => {
                    $(`select[name=selectSuperGroup]`).append(`<option value="${group._id}">${group.employee_super_group_name}</option>`)
                    arrSuperGroup.push(group)
                });
                getOther = false
                
            }
            drawTable(data.dataGroups)
            
        },
        error: function (data) {
            errAjax(data) 
            
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

    arrGroup = []
    for(let i =0;i<data.length;i++)
    {
        arrGroup.push(data[i])
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
                <td>${i+1}</td>
                <td>${data[i].employee_group_name}</td>
                <td>${data[i].super_group_name}</td>
                <td>
                    <button onclick="showPopupEdit(${i})" class="btn btn-primary"><i class="mdi mdi-tooltip-edit"></i> Chỉnh sửa</button> 
                    <button onclick="detailPermission(${i})" class="btn btn-primary"><i class="mdi mdi-information"></i>Xem quyền</button>
                </td>
                
            </tr>
        `)
    }
    dataTable()
}

function drawTablePermission() {
   
    for(let i =0;i<arrFunction.length;i++)
    {
        if( i%2==0)
        {
            $("#divPer1").append(`
                <div class="form-check">
                <input class="form-check-input" value="${arrFunction[i]._id}" type="checkbox" value="" id="permission${i}">
                <label class="form-check-label" for="permission${i}">
                    ${arrFunction[i].function_name}
                </label>
                </div>
            `)
        }
        else
        {
            $("#divPer2").append(`
                <div class="form-check">
                <input class="form-check-input" value="${arrFunction[i]._id}" type="checkbox" value="" id="permission${i}">
                <label class="form-check-label" for="permission${i}">
                    ${arrFunction[i].function_name}
                </label>
                </div>
            `)
        }
    }
   
}

function  editPermission(data,index) {
    $("#divPer1 input[type=checkbox]").prop("checked",false)
    $("#divPer2 input[type=checkbox]").prop("checked",false)

    $("#divPer1 input[type=checkbox]").attr("onchange",`changePermission(this,${index})`)
    $("#divPer2 input[type=checkbox]").attr("onchange",`changePermission(this,${index})`)


    for(let i = 0;i<data.length;i++)
    {
        $(`input[type=checkbox][value="${data[i].id_function}"]`).prop("checked",data[i].permission_status)
    }

    showPopup('popupDetailPermission')
}
function showPopupEdit(index)
{
    $("#edit_employee_group_name").val(arrGroup[index].employee_group_name)
    $("#editSuperGroup").val(arrGroup[index].id_super_group).change()
    $("#btnEditGroup").attr("onclick",`confirmEditGroup(${index})`)
    showPopup('popupEditGroup')
}

function confirmEditGroup(index)
{
    const employee_group_name = $("#edit_employee_group_name").val().trim()
    if(employee_group_name.length == 0)
    {
        info("Tên chức danh không được để trống")
        return
    }
  
    hidePopup('popupEditGroup')
    isLoading();
    $.ajax({
        type: 'put',
        url: `../api/permission/group`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            id_group:arrGroup[index]._id,
            employee_group_name: employee_group_name,
            id_super_group: $('#editSuperGroup option:selected').val()
        },
        cache: false,
        success: function (data) {
            isLoading(false);
            success("Chỉnh sửa thành công")
            getData()
            
        },
        error: function (data) {
            errAjax(data) 
        }
    })
}

function detailPermission(index) {
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/permission?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            id_employee_group:arrGroup[index]._id
        },
        cache: false,
        success: function (data) {
            isLoading(false);
   
            editPermission(data,index)

        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function  changePermission(input, index) {
    var permission_status = false
    if($(input).is(":checked"))
    {
        permission_status = true
    }

    $.ajax({
        type: 'PUT',
        url: `../api/permission`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            permission_status:permission_status,
            id_function:$(input).val(),
            id_employee_group:arrGroup[index]._id
        },
        cache: false,
        success: function (data) {
           
        },
        error: function (data) {
            errAjax(data) 
        }
    })
    
}