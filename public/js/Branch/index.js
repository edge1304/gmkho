var arrBranch = [];
getData()
function getData()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/branch?`,
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
            <th>Tên chi nhánh</th>
            <th>Số điện thoại</th>
            <th>Login in phiếu</th>
            <th>Ảnh</th>
            <th>Chi tiết</th>
        </tr>
        </thead>
        <tbody id="tbodyTable"></tbody>
    </table>`)
    arrBranch = []
    for(let i =0;i<data.length;i++)
    {
        arrBranch.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td>${i+1}</td>
                <td>${data[i].branch_name}</td>
                <td>${data[i].branch_phone}</td>
                <td>${data[i].branch_logo==null?"":`<img src="${URL_IMAGE_BRANCH}${data[i].branch_logo}">`}</td>
                <td>${data[i].branch_image==null?"":`<img src="${URL_IMAGE_BRANCH}${data[i].branch_image}">`}</td>
                <td>
                    <button onclick="editBranch(${i})" class="btn btn-primary"><i class="mdi mdi-tooltip-edit">Chỉnh sửa</i></button>
                </td>
            </tr>
        `)
    }
    dataTable(null,false)
}

function editBranch(index)
{
    $("#editName").val(arrBranch[index].branch_name)
    $("#editPhone").val(arrBranch[index].branch_phone)
    $("#editHeader").val(arrBranch[index].branch_header_content)
    $("#editNote").val(arrBranch[index].branch_note)
    $("#editAddress").val(arrBranch[index].branch_address)

    $("#inputEditLogo").val(null)
    $("#inputEditImage").val(null)

    if(!arrBranch[index].branch_logo)
    {
        $(`#logoEdit`).css({"height":"200px"})
        $("#logoEdit").attr("src",IMAGE_NULL)
        $(`#imageEdit`).css({"height":"200px"})
        $("#imageEdit").attr("src",IMAGE_NULL)
    }
    else
    {
        $(`#logoEdit`).css({"height":"auto"})
        $("#logoEdit").attr("src",URL_IMAGE_BRANCH+ arrBranch[index].branch_logo)

        $(`#imageEdit`).css({"height":"auto"})
        $("#imageEdit").attr("src",URL_IMAGE_BRANCH+ arrBranch[index].branch_image)

    }
    $("#confirmEdit").attr("onclick",`confirmEdit(${index})`)
    showPopup('popupEdit')
}

function changeImage(input)
{
      $(`#${input}`).click()      
}

function paste_Image(input,image)
{
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(`#${image}`).css({"height":"auto"})
            $(`#${image}`).attr("src",e.target.result)
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}


function confirmEdit(index)
{
    const branch_name = $("#editName").val().trim()
    const branch_phone = $("#editPhone").val().trim()
    const branch_address = $("#editAddress").val().trim()
    const branch_logo = $("#inputEditLogo")[0].files[0];
    const branch_image = $("#inputEditImage")[0].files[0];
    const branch_header_content = $("#editHeader").val().trim()
    const branch_note = $("#editNote").val().trim()

    if(branch_name.length == 0)
    {
        info("Tên chi nhánh không được để trống!")
        return ;
    }
    if(typeof branch_logo != 'undefined' && branch_logo.size > MAX_SIZE_IMAGE)
    {
        info("Ảnh logo có kích thước quá lớn, sẽ ảnh hưởng đến việc in phiếu.")
        return
    }

    const data = new FormData()
    data.append('branch_logo',branch_logo)
    data.append('branch_phone',branch_phone)
    data.append('branch_address',branch_address)
    data.append('branch_image',branch_image)
    data.append('branch_name',branch_name)
    data.append('branch_header_content',branch_header_content)
    data.append('branch_note',branch_note)
    data.append('id_branch',arrBranch[index]._id)

    hidePopup('popupEdit')
    isLoading();
    $.ajax({
        type: 'put',
        url: `../api/branch`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: data,
        contentType: false,
        caches:false,
        processData: false,
        
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
    const branch_name = $("#addName").val().trim()
    const branch_phone = $("#addPhone").val().trim()
    const branch_address = $("#addAddress").val().trim()
    const branch_logo = $("#inputAddLogo")[0].files[0];
    const branch_image = $("#inputAddImage")[0].files[0];
    const branch_header_content = $("#addHeader").val().trim()
    const branch_note = $("#addNote").val().trim()

    if(branch_name.length == 0)
    {
        info("Tên chi nhánh không được để trống!")
        return ;
    }
    if(typeof branch_logo != 'undefined' && branch_logo.size > MAX_SIZE_IMAGE)
    {
        info("Ảnh logo có kích thước quá lớn, sẽ ảnh hưởng đến việc in phiếu.")
        return
    }

    const data = new FormData()
    data.append('branch_logo',branch_logo)
    data.append('branch_phone',branch_phone)
    data.append('branch_address',branch_address)
    data.append('branch_image',branch_image)
    data.append('branch_name',branch_name)
    data.append('branch_header_content',branch_header_content)
    data.append('branch_note',branch_note)


    hidePopup('popupAdd')
    isLoading();
    $.ajax({
        type: 'post',
        url: `../api/branch`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: data,
        contentType: false,
        caches:false,
        processData: false,
        
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