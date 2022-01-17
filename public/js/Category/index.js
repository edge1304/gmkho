var arrData = [];
var getOther = true;
var arrSuperCategory = []
getData()

function getData(isLoad=true)
{
    isLoading(isLoading)
    if(!getOther)
    {
        id_super_category = $("#selectSuperCategory option:selected").val()
    }

    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val()

    $.ajax({
        type: 'GET',
        url: `../api/category?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            limit:tryParseInt(limit),
            page: tryParseInt(page),
            category_name: key,
            id_super_category:id_super_category,
            getOther:getOther
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            
            
            if(getOther)
            {
                arrSuperCategory = []
                $("select[name=selectSuper]").empty()
                $("#selectSuperCategory").append(`<option value="" selected>Tất cả</option>`)
                data.arrSuperCategory.forEach( supers => {
                    arrSuperCategory.push(supers)
                    if(supers._id == id_super_category)
                        $("select[name=selectSuper]").append(`<option value="${supers._id}" selected>${supers.super_category_name}</option>`)
                    else $("select[name=selectSuper]").append(`<option value="${supers._id}">${supers.super_category_name}</option>`)
                    
                })
                getOther = false
            }
            drawTable(data.data);
            pagination(data.count,data.data.length)
            changeURL(`?limit=${limit}&page=${page}&category_name=${key}&id_super_category=${id_super_category}`)
          
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
        for(let j = 0;j<arrSuperCategory.length;j++)
        {
            if(data[i].id_super_category == arrSuperCategory[j]._id)
            {
                data[i].super_category_name = arrSuperCategory[j].super_category_name
            }
        }
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td>${stt+i}</td>
                <td>${data[i].category_name}</td>
                <td>${data[i].category_image != null ?`<img src="${URL_IMAGE_CATEGORY}${data[i].category_image}">`:""} </td>
                <td>${data[i].category_status?"Đang hiển thị":"Đã ẩn"}</td>
                <td>${data[i].super_category_name}</td>
                <td>
                    <button onclick="showPopupEdit(${i})" class="badge badge-info"><i class="mdi mdi-information"></i> Chi tiết</button>
                    <button onclick="showKeys(${i})" class="badge badge-success"><i class="mdi mdi-key-minus"></i> Từ khóa</button>
                </td>
            </tr>
        `)
    }
}

function showPopupEdit(index)
{
    
    $("#editName").val(arrData[index].category_name)
    $(`input[type=radio][name=editStatus][value="${arrData[index].category_status}"]`).prop('checked',true)
    if(!arrData[index].category_image) $("#imgEdit").attr("src",IMAGE_NULL)
    else $("#imgEdit").attr("src",URL_IMAGE_CATEGORY+ arrData[index].category_image)
    $("#inputEditImage").val(null)


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
    const category_name = $("#editName").val().trim()
    const id_super_category = $("#selectSuperEditCategory option:selected").val().trim()
    
    const category_status =  $(`input[type=radio][name=editStatus]:checked`).val()
    const category_image = $("#inputEditImage")[0].files[0];

    if(!category_name){
        info("Tên danh mục không được để trống")
        return
    }
    if(!id_super_category || id_super_category.length != 24){
        info("Danh mục lớn không được để trống")
        return
    }

    var data = new FormData()
    data.append('category_name',category_name)
    data.append('category_status',category_status)
    data.append('category_image',category_image)
    data.append('id_super_category',id_super_category)
    data.append('id_category',arrData[index]._id)
   
    hidePopup('popupEdit')
    isLoading();
    $.ajax({
        type: 'put',
        url: `../api/category`,
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
    const category_name = $("#addName").val().trim()
    const id_super_category = $("#selectSuperAddCategory option:selected").val().trim()
    
    const category_status =  $(`input[type=radio][name=addStatus]:checked`).val()
    const category_image = $("#inputAddImage")[0].files[0];

    if(!category_name){
        info("Tên danh mục không được để trống")
        return
    }
    if(!id_super_category || id_super_category.length != 24){
        info("Danh mục lớn không được để trống")
        return
    }

    var data = new FormData()
    data.append('category_name',category_name)
    data.append('category_status',category_status)
    data.append('category_image',category_image)
    data.append('id_super_category',id_super_category)
   
    hidePopup('popupAdd')
    isLoading();
    $.ajax({
        type: 'post',
        url: `../api/category`,
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

function confirmAddSuper()
{
    const super_category_name = $("#addNameSuper").val().trim()
    if(!super_category_name){
        info("Tên danh mục không được để trống")
        return
    }
    
    hidePopup('popupAddSuper')
    isLoading();
    $.ajax({
        type: 'post',
        url: `../api/supercategory`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            super_category_name:super_category_name
        },
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            getOther = true
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

function showKeys(index)
{

    $("#tbodyKey").empty()
    if(arrData[index].category_options)
    {
        var stt2 = 1
        Object.keys(arrData[index].category_options).map(key =>{
            let html = `<tr><td>${stt2++}</td><td>${key}</td><td>`
            for(let i = 0;i<arrData[index].category_options[key].length;i++)
            {
                html += `${arrData[index].category_options[key][i]}, `
            }
            html += `</td><td>
                        <i onclick="editKey(${index},'${key}')" class="mdi mdi-tooltip-edit text-primary"></i>
                        <i onclick="showPopupDeleteKey(${index},'${key}')" class="mdi mdi-delete-forever text-danger"></i>
                    </td></tr>`
            $("#tbodyKey").append(html)
        })
    }
    $("#confirmAddKey").attr("onclick",`confirmSaveAddKey(${index})`)
    showPopup('popupDetailKey')
}

function changeValueKey(input)
{
    if(event.which == '13')
    {
        const str = $(input).val().trim().split(' / ')
        var result = ""
        for(let i = 0;i<str.length;i++)
        {
            if(str[i].trim() != '/' && str[i].trim().length > 0)
            {
                result += str[i].trim() +" / "
            }
        }
        $(input).val(result)

    }
}

function confirmSaveAddKey(index)
{
  
    var arrKey = []

    const key =  $("#addKey").val().trim()
    if(key.length == 0)
    {
        info("Từ khóa không được để trống")
        return
    }

    const str = $("#addValueKey").val().trim().split(' / ')
    for(let i = 0;i<str.length;i++)
    {
        if(str[i].trim() != '/' && str[i].trim().length > 0)
        {
            arrKey.push(str[i].trim())
        }
    }
    if(arrKey.length == 0)
    {
        info("Phải có ít nhất 1 giá trị")
        return
    }
    hidePopup('popupAddKey')
    hidePopup('popupDetailKey')
    isLoading();
    $.ajax({
        type: 'post',
        url: `../api/category/key`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            category_key:key,
            values:arrKey,
            id_category:arrData[index]._id
        },
       
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            arrData[index].category_options = data.category_options
            showKeys(index)
            
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}


function editKey(index, key)
{
    $("#editKey").val(key)
    var strVal = ''
    for(let i =0;i<arrData[index].category_options[key].length;i++)
    {
        strVal += arrData[index].category_options[key][i] +" / "
    }
    $("#editValueKey").val(strVal)
    $("#btnconfirmEditKey").attr("onclick",`confirmEditKey(${index},'${key}')`)
    showPopup('popupEditKey',false,'popupDetailKey')
}

function confirmEditKey(index, oldKey)
{
    var arrKey = []
    const key =  $("#editKey").val().trim()
    if(key.length == 0)
    {
        info("Từ khóa không được để trống")
        return
    }

    const str = $("#editValueKey").val().trim().split(' / ')
    for(let i = 0;i<str.length;i++)
    {
        if(str[i].trim() != '/' && str[i].trim().length > 0)
        {
            arrKey.push(str[i].trim())
        }
    }
    if(arrKey.length == 0)
    {
        info("Phải có ít nhất 1 giá trị")
        return
    }
    hidePopup('popupEditKey')
    isLoading();
    $.ajax({
        type: 'put',
        url: `../api/category/key`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            category_key:key,
            values:arrKey,
            oldKey:oldKey,
            id_category:arrData[index]._id,
        },
       
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            arrData[index].category_options = data.category_options
            showKeys(index)
            
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function showPopupDeleteKey(index , key)
{
    $("#btnconfirmDeleteKey").attr("onclick",`confirmDeleteKey(${index},'${key}')`)
    showPopup('popupDeleteKey')
}

function confirmDeleteKey(index , key)
{

    hidePopup('popupDeleteKey')
    isLoading();
    $.ajax({
        type: 'delete',
        url: `../api/category/key`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            category_key:key,
            id_category:arrData[index]._id,
        },
       
        caches:false,
        success: function (data) {
            isLoading(false);
            success("Thành công")
            arrData[index].category_options = data.category_options
            showKeys(index)
            
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}