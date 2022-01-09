var arrData = [];
var loadOther = true;

function getData(isLoad=true)
{

    isLoading(isLoad);
    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val(),
    $.ajax({
        type: 'GET',
        url: `../api/employee?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            limit:tryParseInt(limit),
            page: tryParseInt(page),
            key: key,
            loadOther:loadOther
        },
      
        cache: false,
        success: function (data) {
            
            isLoading(false);
            drawTable(data.data);
            pagination(data.count,data.data.length)
            changeURL(`?limit=${limit}&page=${page}&key=${key}`)
            if(loadOther) // load dữ liệu lần thứ nhất
            {
                data.branches.forEach(branch =>
                {
                    $("select[name=selectBranch]").append(`<option value="${branch._id}">${branch.branch_name}</option>`);
                })

                data.groupUsers.forEach(group =>
                {
                    $("select[name=selectGroup]").append(`<option value="${group._id}">${group.employee_group_name}</option>`);
                })
            }
            loadOther = false;
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

    $("#tbodyTable").empty()
    arrData = []
    for(let i =0;i<data.length;i++)
    {
        arrData.push(data[i])
        $("#tbodyTable").append(`<tr><td class="center">${stt+i}</td><td>${escapehtml(data[i].employee_fullname)}</td><td>${escapehtml(data[i].employee_phone)}</td><td>${escapehtml(data[i].employee_group_name)}</td><td class="center">${data[i].employee_status?'Đang hoạt đông':'Đã nghỉ'}</td><td class="money">${money(data[i].employee_salary)}</td><td class="money">${money(data[i].employee_salary_duty)}</td><td class="center"><i onclick="showPopupEdit(${i})" class="mdi mdi-tooltip-edit"></i></td></tr>`)
    }
}

function showPopupEdit(index)
{
    console.log(arrData[index])
    $("#editName").val(arrData[index].employee_fullname)
    $("#editPhone").val(arrData[index].employee_phone)
    $("#editSalary").val(money(arrData[index].employee_salary))
    $("#editSalaryDuty").val(money(arrData[index].employee_salary_duty))
    $("#selectBranchEdit").val(arrData[index].id_branch).change()
    $("#selectGroupEdit").val(arrData[index].id_employee_group).change()
    $("#editPassword").val(null);

    $(`input[name=editStatus][value=${arrData[index].employee_status}]`).prop("checked",true)
    $("#btnConfirmEdit").attr("onclick",`confirmSaveEdit(${index})`)
    showPopup('popupEdit')
}

function confirmSaveEdit(index)
{
    const employee_fullname = $("#editName").val()
    const employee_phone = $("#editPhone").val()
    const employee_salary = tryParseInt($("#editSalary").val())
    const employee_salary_duty = tryParseInt($("#editSalaryDuty").val())
    const id_branch = $("#selectBranchEdit option:selected").val()
    const id_employee_group = $("#selectGroupEdit option:selected").val()
    const employee_status = $(`input[name=editStatus]:checked`).val()

    var password = $("#editPassword").val()
    if(password.length > 0) password = sha512(password)

    if(employee_fullname.length == 0)
    {
        info("Tên nhân viên không được để trống")
        return;
    }
    if(employee_phone.length == 0)
    {
        info("Số điện thoại không được để trống")
        return
    }

    isLoading()
    hidePopup('popupEdit');

    $.ajax({
        type: 'PUT',
        url: `../api/employee`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            employee_fullname :employee_fullname ,
            employee_phone :employee_phone ,
            employee_salary :employee_salary ,
            employee_salary_duty :employee_salary_duty ,
            id_branch :id_branch ,
            id_employee_group :id_employee_group ,
            password :password ,
            employee_status:employee_status,
            _id: arrData[index]._id
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            success("Cập nhập thành công!");
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


function showPopupAdd()
{
    $("#addName").val(null)
    $("#addPhone").val(null)
    $("#addSalary").val(0)
    $("#addSalaryDuty").val(0)
    $("#addSalaryDuty").val(0)
    $("#addPassword").val(1)

    showPopup('popupAdd')
}

function confirmAdd()
{
    const employee_fullname = $("#addName").val()
    const employee_phone = $("#addPhone").val()
    const employee_salary = tryParseInt($("#addSalary").val())
    const employee_salary_duty = tryParseInt($("#addSalaryDuty").val())
    // const id_branch = $("#selectBranchadd option:selected").val()
    const id_employee_group = $("#selectGroupadd option:selected").val()
    const employee_status = $(`input[name=addStatus]:checked`).val()

    var password = $("#addPassword").val()
    if(password.length > 0) password = sha512(password)

    if(employee_fullname.length == 0)
    {
        info("Tên nhân viên không được để trống")
        return;
    }
    if(employee_phone.length == 0)
    {
        info("Số điện thoại không được để trống")
        return
    }

    isLoading()
    hidePopup('popupAdd');
    $.ajax({
        type: 'POST',
        url: `../api/employee`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            employee_fullname :employee_fullname ,
            employee_phone :employee_phone ,
            employee_salary :employee_salary ,
            employee_salary_duty :employee_salary_duty ,
            // id_branch :id_branch ,
            id_employee_group :id_employee_group ,
            password :password ,
            employee_status:employee_status,
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            success("Thêm mới thành công!");
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