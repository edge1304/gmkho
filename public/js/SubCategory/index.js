var arrData = [];
var getOther = true;
var arrCategory = []
getData()

function getData(isLoad=true)
{
    isLoading(isLoading)
    if(!getOther)
    {
        id_category = $("#selectCategory option:selected").val()
    }
    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val()

    $.ajax({
        type: 'GET',
        url: `../api/subcategory?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            limit:tryParseInt(limit),
            page: tryParseInt(page),
            id_category: id_category,
            key: key,
            getOther:getOther
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            if(getOther)
            {
                arrCategory= []
                $("#selectCategory").append(`<option value="">Tất cả</option>`)
                data.arrCategory.map( category =>{
                    arrCategory.push(category)
                    if(id_category == category._id)
                    {
                        $("select[name=selectCategory]").append(`<option selected value="${category._id}">${category.category_name}</option>`)
                    }
                    else
                    {
                        $("select[name=selectCategory]").append(`<option value="${category._id}">${category.category_name}</option>`)
                    }
                })
                getOther = false
            }
            drawTable(data.data);
            pagination(data.count,data.data.length)
            changeURL(`?limit=${limit}&page=${page}&subcategory_name=${key}&id_category=${id_category}`)
          
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
    for(let i = 0; i <data.length;i++)
    {
        data[i].category_name = ""
        for(let j = 0;j<arrCategory.length;j++)
        {
            if(data[i].id_category == arrCategory[j]._id)
            {
                data[i].category_name = arrCategory[j].category_name
                break
            }
        }

        $("#tbodyTable").append(`
            <tr>
                <td class="center">${stt+i}</td>
                <td >${data[i].subcategory_name}</td>
                <td >${data[i].category_name}</td>
                <td >${money(data[i].subcategory_import_price)}</td>
                <td >${money(data[i].subcategory_export_price)}</td>
                <td >${money(data[i].subcategory_discount)}</td>
                <td >${money(data[i].subcategory_part)}</td>
                <td >${money(data[i].subcategory_point)}</td>
                <td><i class="mdi mdi-information text-primary">Chi tiết</i></td>
            </tr>
        `)
    }

    
}

function confirmAdd()
{
    const subcategory_name = $("#addName").val().trim()
    const subcategory_import_price = tryParseInt($("#addImportPrice").val())
    const subcategory_export_price = tryParseInt($("#addExportPrice").val())
    const subcategory_vat = tryParseInt($("#addVAT").val())
    const subcategory_ck = tryParseInt($("#addCK").val())
    const subcategory_discount = tryParseInt($("#addDiscount").val())
    const subcategory_warranty = tryParseInt($("#addWarranty").val())
    const subcategory_part = tryParseInt($("#addPart").val())
    const subcategory_point = tryParseInt($("#addPoint").val())
    const subcategory_unit = $("#addUnit").val().trim().length == 0?"Chiếc":$("#addUnit").val().trim()
    const number_warning = tryParseInt($("#addWarning").val())
    const id_category = $("#addCategory option:selected").val()

    if(id_category.length != 24 ){
        info("Danh mục không được để trống")
        return
    }
    if(subcategory_name.length == 0 )
    {
        info("Tên sản phẩm không được để trống")
        return
    }

    hidePopup('popupAdd')
    isLoading()
    $.ajax({
        type: 'post',
        url: `../api/subcategory`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            subcategory_name:subcategory_name,
            subcategory_import_price:subcategory_import_price,
            subcategory_export_price:subcategory_export_price,
            subcategory_vat:subcategory_vat,
            subcategory_ck:subcategory_ck,
            subcategory_discount:subcategory_discount,
            subcategory_warranty:subcategory_warranty,
            subcategory_part:subcategory_part,
            subcategory_point:subcategory_point,
            subcategory_unit:subcategory_unit,
            number_warning:number_warning,
            id_category:id_category,
        },
        cache: false,
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

function downloadTemplate()
{
    var dataDownload = [{
        "Tên sản phẩm":"",
        "Mã danh mục":"",
        "Giá nhập":"",
        "Giá bán":"",
        "VAT":"",
        "CK":"",
        "Giảm giá":"",
        "Bảo hành":"",
        "Part thưởng":"",
        "Điểm thưởng":"",
        "Số lượng cảnh báo":"",
        "Đơn vị tính":"",
    }];
   

    downloadExcelLocal(dataDownload,"Mẫu thêm sản phẩm")
}

function selectAdddExcel()
{
    $("#inputAddExcel").click()
}
function changeFileExcel(input) {
var fileUpload = document.getElementById("inputAddExcel")

    //Validate whether File is valid Excel file.

    if (typeof(FileReader) != "undefined") {
        var reader = new FileReader();

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function(e) {
                drawTableAddExcel(e.target.result);
            };
            reader.readAsBinaryString(fileUpload.files[0]);
        } else {
            //For IE Browser.
            reader.onload = function(e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                drawTableAddExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
        }
    } else {
        info("Brower không hỗ trợ đọc excel");
    }

};

function drawTableAddExcel(data) {
    

    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    var Sheet = workbook.SheetNames[0];
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
    var x = [];
    arrayExcel = [];
    let html1 = '';
    for (var i = 0; i < excelRows.length; i++) {
        console.log(excelRows[i])
    }
    $("#tbodyExcel").html(html1);

};

