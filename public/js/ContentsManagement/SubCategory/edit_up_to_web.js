getData()
var limitProduct = 10;
var page = 1
var arrFindRelated = []
var subcategory_related = []
var subcategory_options = {}
var arr_image_delete = []
function getData()
{
    $.ajax({
        type: 'GET',
        url: `../api/subcategory/up-to-website?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            id_subcategory:id_subcategory
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            drawTable(data.dataSub, data.dataCategory, data.dataWarranty, data.dataPromotion)
          
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function drawTable(dataSub, dataCategory, dataWarranty, dataPromotion)
{
    dataPromotion.forEach(pro => {
        if(pro._id == dataSub.id_combo_promotion)  // combo khuyễn mãi
        {
            $("#selectPromotion").append(`<option selected value="${pro._id}">${pro.promotion_combo_name}</option>`)
        }
        else
        {
            $("#selectPromotion").append(`<option value="${pro._id}">${pro.promotion_combo_name}</option>`)
        }
    });

    dataWarranty.forEach(war => {   // combo bảo hành
        if(war._id == dataSub.id_combo_warranty)
        {
            $("#selectWarranty").append(`<option selected value="${war._id}">${war.warranty_combo_name}</option>`)
        }
        else
        {
            $("#selectWarranty").append(`<option value="${war._id}">${war.warranty_combo_name}</option>`)
        }
    });

    if(dataSub.subcategory_specifications ) $("#tbody_specifications").empty()
    if(dataSub.subcategory_specifications)
    {
        Object.keys(dataSub.subcategory_specifications).map( key =>   // option của sản phẩm
            {
                $("#tbody_specifications").append(`
                <tr>
                    <td><input oninput="inputNumber(this)" value="${stt++}" class="number form-control text-center" ></td>
                    <td><input type="text" value="${key}" class="form-control" placeholder="Nhập thuộc tính"></td>
                    <td><input type="text" value="${dataSub.subcategory_specifications[key]}" class="form-control" placeholder="Nhập giá trị"></td>
                    <td><i onclick="deleteSpecifications(this)" class="mdi mdi-delete-forever text-danger"></i></td>
                </tr>`)
            })
    }
  

   
    if(dataCategory.category_options )
    {
        Object.keys(dataCategory.category_options).map( key =>  // option của danh mục
            {
                var htmlCategory_options = `<tr><td>${key}</td><td>`
                var isCheched = ""
                for(let i = 0 ;i<dataCategory.category_options[key].length;i++)
                {
                    
                    if(dataSub.subcategory_options != null && typeof dataSub.subcategory_options[key] != 'undefined' && dataCategory.category_options[key][i] == dataSub.subcategory_options[key]) isCheched = "checked"
                    htmlCategory_options += `
                        <div class="form-check">
                        <input ${isCheched} class="form-check-input" type="radio" name="${key}" value="${dataCategory.category_options[key][i]}" id="category_options${stt}">
                        <label class="form-check-label" for="category_options${stt}">
                            ${dataCategory.category_options[key][i]}
                        </label>
                        </div>`
                    stt++
                    isCheched = ""
                }
                htmlCategory_options += `</td><td><i onclick="cancelCategoryOpiton(this)" class="mdi mdi-delete-forever text-danger"></i></td></tr>`
                $("#table_category_specifications").append(htmlCategory_options)
            })
    }
  
        

    CKEDITOR.instances.editor.setData(dataSub.subcategory_content); // set nội dung bài viết

    subcategory_related = dataSub.subcategory_related  //danh sách sản phẩm liên quan
    drawSubcategory_related()

    $('input[name=replace_name]').val( !dataSub.subcategory_replace_name?dataSub.subcategory_name:dataSub.subcategory_replace_name ) //tên sản phẩm thay thế
    if(dataSub.subcategory_video) $("input[name=link_video]").val(`https://www.youtube.com/watch?v=${dataSub.subcategory_video}`)
    $("#tags").val(dataSub.subcategory_tags)
    $("#seo_image").val(dataSub.subcategory_seo_image)
    $("#seo_meta_keyword").val(dataSub.subcategory_seo_meta_keyword)
    $("#seo_meta_description").val(dataSub.subcategory_seo_description)

    for(let i = 0 ;i<dataSub.subcategory_sale_status.length;i++)
    {
        $(".div-subcategory_sale_status").append(`
        <tr>
            <td>${dataSub.subcategory_sale_status[i]}</td>
            <td><i onclick="removeStatus(this)" class="mdi mdi-delete-forever text-danger"></i></td>
        </tr>`)
        $(`#select_subcategory_sale_status option[value='${dataSub.subcategory_sale_status[i]}']`).remove()
    }

    // ảnh sản phẩm trước đó
    for(let i =0;i<dataSub.subcategory_images.length;i++)
    {
        $(".div-image-period").append(`
            <div class="col-md-2 relative">
                <img src="${URL_IMAGE_PRODUCT}${dataSub.subcategory_images[i]}">
                <input type="text" value="${dataSub.subcategory_images[i]}">
                <i onclick="removeImagePeriod(this)" class="mdi mdi-delete-forever text-danger"></i>
                
              </div>
        `)
    }
}

function deleteSpecifications(tagI)  // xóa thông số kĩ thuật của sản phẩm
{
    $(tagI).closest('tr').remove()
}

function cancelCategoryOpiton(tagI)  // hủy thông số kĩ thuật của danh mục
{
    $(tagI).closest('tr').find('input[type=radio]:checked').prop("checked",false)
}

function findRelatedProduct(loadmore = false)
{
    $("#input_find_subcategory_related").closest("div").find('.spinner-border').show()
    if(!loadmore)
    {
        $("#div_load_related_product").empty()
        arrFindRelated = []
        page = 1
    }
   
    
    $.ajax({
        type: 'GET',
        url: `../api/subcategory/findOther?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            key:$("#input_find_subcategory_related").val(),
            limit:limitProduct,
            page:page
        },
      
        cache: false,
        success: function (data) {
            $("#input_find_subcategory_related").closest("div").find('.spinner-border').hide()
            if(!loadmore)
            {
                $("#div_load_related_product").empty()
                arrFindRelated = []
            }
            drawDivProductRelated(data)
        },
        error: function (data) {
            $(input).closest("div").find('.spinner-border').hide()
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function drawDivProductRelated(data)
{
    for(let i =0;i<data.length;i++)
    {
        arrFindRelated.push(data[i])
        $("#div_load_related_product").append(`<li><a onclick="selectProduct(${arrFindRelated.length-1})" href="javascript:void(0)">${data[i].subcategory_name}</a></li>`)
    }
}

function loadMoreSubCategory(div)
{
    if($(div).scrollTop() + $(div).innerHeight() >= $(div)[0].scrollHeight) {
        page += 1
        findRelatedProduct(true)
    }
}

function selectProduct(index)
{
    $("#input_find_subcategory_related").val(arrFindRelated[index].subcategory_name)
    $("#div_load_related_product").empty()
}

function addRelatedProduct()
{
    const subcategory_related_name = $("#input_find_subcategory_related").val().trim()
    if(subcategory_related_name.length == 0) return

    const replace_name = $("#name_replace_product").val().trim()
    if(replace_name.length == 0) 
    {
        info("Tên thay thế không được để trống!")
        return
    }
    for(let i = 0;i<arrFindRelated.length;i++)
    {
        if(arrFindRelated[i].subcategory_name == subcategory_related_name)
        {
            for(let j = 0 ; j<subcategory_related.length;j++)
            {
                if(arrFindRelated[i]._id == subcategory_related[j].id_subcategory )
                {
                    info(`Sản phẩn này đã được thêm vào mới tên thay thế là ${subcategory_related[j].replace_name}`)
                    return
                }

                if(replace_name == subcategory_related[j].replace_name )
                {
                    info(`Tên thay thế đã tồn tạ`)
                    return
                }

            }
            subcategory_related.push({replace_name:replace_name, id_subcategory:arrFindRelated[i]._id})
            $("#input_find_subcategory_related").val(null)
            $("#name_replace_product").val(null)

            drawSubcategory_related()
            break
        }
    }
}

function drawSubcategory_related()
{
    $(".div-related-product").empty()
    for(let i =0;i<subcategory_related.length;i++)
    {
        $(".div-related-product").append(`
            <a class="col-6 col-md-5 col-lg-4 col-xl-2 center">
                <i onclick="removeRelated(${i})" class="mdi mdi-bookmark-remove text-danger"></i>
                <span class="name_related-product">${subcategory_related[i].replace_name}</span>
            </a>
        `)
    }
}

function enterAddRelatedProduct()
{
    if(event.which == '13')
    {
        addRelatedProduct()
    }
}

function removeRelated(index)
{
    subcategory_related.splice(index,1)
    drawSubcategory_related()
}

function addStatus()
{
    $(".div-subcategory_sale_status").append(`
        <tr>
            <td>${$("#select_subcategory_sale_status option:selected").val()}</td>
            <td><i onclick="removeStatus(this)" class="mdi mdi-delete-forever text-danger"></i></td>
        </tr>`)
        $("#select_subcategory_sale_status option:selected").remove()
}

function removeStatus(tagI)
{
    const status = $(tagI).closest('tr').find('td').html()
    $("#select_subcategory_sale_status").append(`<option selected value="${status}">${status}</option>`)
    $(tagI).closest('tr').remove()

}

function add_specifications()
{
    $("#tbody_specifications").prepend(`
    <tr>
        <td><input oninput="inputNumber(this)" value="0" class="number form-control text-center" ></td>
        <td><input type="text" value="" class="form-control" placeholder="Nhập thuộc tính"></td>
        <td><input type="text" value="" class="form-control" placeholder="Nhập giá trị"></td>
        <td><i onclick="deleteSpecifications(this)" class="mdi mdi-delete-forever text-danger"></i></td>
    </tr>`)
}







function confirmSave()
{
    // Create a form.
    const formData = new FormData();
    for (var i = 0; i < totalFiles.length; i++) {
        formData.append("image_product", totalFiles[i].file); // ảnh sản phẩm
    }
    formData.append('subcategory_specifications',JSON.stringify(getSpecifications())) // thông số kĩ thuật
    formData.append('subcategory_options',JSON.stringify(getOptions())) // option từ danh mục
    formData.append('subcategory_sale_status',JSON.stringify(getStatus())) // trạng thái sale
    const id_combo_promotion = $("#selectPromotion option:selected").val().trim().length == 0?"":$("#selectPromotion option:selected").val().trim() // combo khuyến mãi
    formData.append('id_combo_promotion',id_combo_promotion)
    const id_combo_warranty = $("#selectWarranty option:selected").val().trim().length == 0?"":$("#selectWarranty option:selected").val().trim() // combo khuyến mãi
    formData.append('id_combo_warranty',id_combo_warranty)
    formData.append('subcategory_replace_name',$("input[name=replace_name]").val().trim())
    formData.append('subcategory_tags',$("#tags").val())
    formData.append('subcategory_seo_image',$("#seo_image").val())
    formData.append('subcategory_seo_description',$("#seo_meta_description").val())
    formData.append('subcategory_video', $("input[name=link_video]").val().length > 0? $("input[name=link_video]").val().split('=')[1].split('&')[0]:"")
    formData.append('subcategory_content', CKEDITOR.instances.editor.getData())
    formData.append('subcategory_related', JSON.stringify(subcategory_related))
    formData.append('arr_image_delete', JSON.stringify(arr_image_delete))
    formData.append('id_subcategory', id_subcategory)

    isLoading()
    $.ajax({
        type: 'PUT',
        url: `../api/subcategory/up-to-website`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: formData,
        contentType: false,
        caches:false,
        processData: false,
        success: function (data) {
            isLoading(false)
            success("Thành công")
            // location.reload()
        },
        error: function (data) {
            isLoading(false)
            if(data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                info(data.responseText);
            
        }
    })
}

function getSpecifications()
{
    const tr_specifications = $("#tbody_specifications").find('tr')
    var arr_subcategory_specifications = []
    for(let i =0;i<tr_specifications.length;i++)
    {

        if($($($(tr_specifications[i]).find('input'))[1]).val().trim().length != 0 && $($($(tr_specifications[i]).find('input'))[2]).val().trim().length != 0)
        {
            arr_subcategory_specifications.push({
                Number:tryParseInt($($($(tr_specifications[i]).find('input'))[0]).val()),
                Key:$($($(tr_specifications[i]).find('input'))[1]).val().trim(),
                Value:$($($(tr_specifications[i]).find('input'))[2]).val().trim()
            })
        }
        
        
    }
    // sắp xếp lại theo số thứ tự
    for(let i = 0;i<arr_subcategory_specifications.length;i++)
    {
        for(let j = 0;j<arr_subcategory_specifications.length;j++)
        {
            if(arr_subcategory_specifications[i].Number < arr_subcategory_specifications[j].Number)
            {
                var tam = arr_subcategory_specifications[i]
                arr_subcategory_specifications[i] = arr_subcategory_specifications[j]
                arr_subcategory_specifications[j] = tam 
            }
        }
    }
    var arrData = {}
    for(let i =0;i<arr_subcategory_specifications.length;i++)
    {
        arrData = {
            ...arrData,
            [arr_subcategory_specifications[i].Key]:arr_subcategory_specifications[i].Value
        }
    }

    return arrData
}

function getOptions()
{
    const options = $("#table_category_specifications").find('tr')
    var arrOptions = {}
    for(let i =0;i<options.length;i++)
    {
        const key = $($($(options[i]).find('td'))[0]).html()

        
        const values = $($($($(options[i]).find('td'))[1]).find('input[type=radio]'))
        // console.log(values)
        for(let i =0;i<values.length;i++)
        {
            if($(values[i]).is(":checked"))
            {
                arrOptions = {
                        ...arrOptions,
                        [key]:$(values[i]).val()
                    }
            }
        }
    }
    return arrOptions
}

function getStatus()
{
    var arrStatus = []
    const status = $("#div_status").find('td:first-child')
    for(let i =0;i<status.length;i++)
    {
        arrStatus.push($(status[i]).html().trim())
    }
    return arrStatus 
}

function removeImagePeriod(btnRemove)
{
    const image_delete = $($($(btnRemove).closest('div').find('input'))[0]).val()
    arr_image_delete.push(image_delete)
    $(btnRemove).closest('div').remove()
}