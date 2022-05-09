var arrCategory = []
var MAX_SERIAL_NUMBER = 0
var DATA_ALL_MENU = []
var DATA_ALL_CATEGORY = []
//==================================================================================================================

$(function () {
    const page = 1
    getData(page)
})
function getData(page) {
    isLoading()
    limit = parseInt($("#selectLimit").val())
    let key = $("#keyFind").val()
    $.ajax({
        type: "GET",
        url: `../api/menu`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            key: key,
            id_parent: $("#select_Menu option:selected").val() || ``,
            limit: limit,
            page: page,
        },
        cache: false,
        success: function (data) {
            isLoading(false)
            throwValue(data)
            MAX_SERIAL_NUMBER = data?.max_serial_number + 10 || 10
            DATA_ALL_MENU = data.data_all
            DATA_ALL_CATEGORY = data.data_all_category
            draw_List_category_website(data.id_parent)
            drawTable(data.data)
            pagination(data.count, data.data.length)
        },
        error: function (data) {
            errAjax(data)
        },
    })
}
function draw_List_category_website(id_parent) {
    $(`#select_Menu`).empty()
    let check = 0
    DATA_ALL_MENU.forEach((element) => {
        if (element["_id"] + "" == id_parent + "") {
            check++
            $("#select_Menu").append(`<option selected value="${element["_id"]}">${element["name"]}</option>`)
            $("#select_Menu").append(`<option value="">____ Chọn menu cha ____</option>`)
            return
        }
    })
    if (check == 0) {
        $("#select_Menu").append(`<option selected value="">____ Chọn menu cha ____</option>`)
    }
    load_parent_menu("select_Menu", null, "")
}
function drawTable(data) {
    arrCategory = []
    $("#tbodyTable").empty()
    for (let i = 0; i < data.length; i++) {
        arrCategory.push(data[i])
        let image = `<img style="width:80px ; height:80px" src="${URL_IMAGE_MENU}${data[i]["Image"]}">`
        if (data[i]["Image"] == null || typeof data[i]["Image"] == "undefined") image = ""
        $("#tbodyTable").append(`
            <tr>
                <td class="center">${i + 1}</td>
                <td class="text-center"><input onchange="change_serial_number('${data[i]._id}',this)" type="number" value="${data[i].serial_number}" class="form-control"></td>
                <td>${data[i].name}</td>
                <td>${data[i]?.data_parent?.name || "---"}</td>
                <td>${data[i]["link"]}</td>
                <td class="center"><button onclick="showPopupEdit(${i})" class="btn btn-danger">Chi tiết</button></td>
            </tr>
        `)
    }
}
function showPopupEdit(index) {
    $("#btnConfirmEdit").attr("onclick", `confirmEdit(${index})`)
    //load parent categỏy+
    const idcategory = arrCategory[index]._id
    const parent_id = typeof arrCategory[index].id_parent == "undefined" ? null : arrCategory[index].id_parent
    const id_represent_category = typeof arrCategory[index].id_parent == "undefined" ? null : arrCategory[index].id_represent_category
    const name = arrCategory[index].name
    const serial_number = arrCategory[index].serial_number
    const link = arrCategory[index].link
    //

    $(`#serial_number_edit`).val(serial_number)
    $(`#link_edit`).val(link)
    $(`#select_parent_menu_edit`).empty()
    $("#idEditCategory").val(idcategory)
    $("#name_Menu_edit").val(name)
    let check = 0
    DATA_ALL_MENU.forEach((element) => {
        if (element["_id"] + "" == parent_id + "") {
            check++
            $("#select_parent_menu_edit").append(`<option selected value="${element["_id"]}">${element["name"]}</option>`)
            $("#select_parent_menu_edit").append(`<option value="">_____________________</option>`)
            return
        }
    })
    if (check == 0) {
        $("#select_parent_menu_edit").append(`<option selected value="">_____________________</option>`)
    }
    load_parent_menu("select_parent_menu_edit", null, "") //
    let check1 = 0
    $("#select_represent_category_edit").empty()
    DATA_ALL_CATEGORY.forEach((element) => {
        if (element["_id"] + "" == id_represent_category + "") {
            check1++
            $("#select_represent_category_edit").append(`<option selected value="${element["_id"]}">${element["category_name"]}</option>`)
            $("#select_represent_category_edit").append(`<option value="">_____________________</option>`)
            return
        }
    })
    if (check1 == 0) {
        $("#select_represent_category_edit").append(`<option selected value="">_____________________</option>`)
    }
    load_parent_category("select_represent_category_edit", null, "")
    //
    $("#display_app_edit").prop("checked", tryParseBoolean(arrCategory[index].display_app))
    $("#display_app_edit").val(tryParseBoolean(arrCategory[index].display_app))
    $("#display_website_edit").prop("checked", tryParseBoolean(arrCategory[index].display_website))
    $("#display_website_edit").val(tryParseBoolean(arrCategory[index].display_website))
    $("#display_tree_edit").prop("checked", tryParseBoolean(arrCategory[index].display_tree))
    $("#display_tree_edit").val(tryParseBoolean(arrCategory[index].display_tree))
    $("#display_home_edit").prop("checked", tryParseBoolean(arrCategory[index].display_home))
    $("#display_home_edit").val(tryParseBoolean(arrCategory[index].display_home))

    $(`#edit_image_menu`).attr(`src`, `${URL_IMAGE_MENU}${arrCategory[index]?.image}`)
    $(`#edit_icon_menu`).attr(`src`, `${URL_IMAGE_MENU}${arrCategory[index]?.icon}`)
    //
    showPopup(`popupEdit`)
}
function confirmEdit(index) {
    const _id = arrCategory[index]._id
    const name = $("#name_Menu_edit").val()
    const link_edit = $("#link_edit").val()
    const serial_number = $("#serial_number_edit").val()
    //
    const display_app = $("#display_app_edit").val()
    const display_website = $("#display_website_edit").val()
    const display_tree = $("#display_tree_edit").val()
    const display_home = $("#display_home_edit").val()
    //
    const id_parent = $("#select_parent_menu_edit").val()
    const id_represent_category = $("#select_represent_category_edit").val()
    //
    const image = $("#edit_input_image_menu")[0].files[0]
    const check_delete_image = $("#edit_image_menu_change").val()
    const icon = $("#edit_input_icon_menu")[0].files[0]
    const check_delete_icon = $("#edit_icon_menu_change").val()
    var data = new FormData()
    data.append(`_id`, _id)
    data.append(`name`, name)
    data.append(`link`, link_edit)
    data.append(`id_parent`, id_parent)
    data.append(`check_parent_category`, 1)
    data.append(`id_represent_category`, id_represent_category)
    data.append(`serial_number`, serial_number)
    //
    data.append(`display_app`, display_app)
    data.append(`display_website`, display_website)
    data.append(`display_tree`, display_tree)
    data.append(`display_home`, display_home)
    //
    data.append(`image`, image)
    data.append(`check_delete_image`, check_delete_image)
    data.append(`icon`, icon)
    data.append(`check_delete_icon`, check_delete_icon)
    //
    hidePopup("popupEdit")
    callAPI(
        "PUT",
        API_MENU,
        data,
        () => {
            success("Thành công")
            getData()
        },
        undefined,
        true,
        true
    )
}
function showPopupAdd() {
    //load parent categỏy+
    $("#check_delete_image_add").val(0)
    $("#serial_number_add").val(MAX_SERIAL_NUMBER)
    $(`#name_Menu_add`).val(null)
    $(`#link_add`).val(null)
    $(`#select_parent_menu_add`).empty()
    $("#select_parent_menu_add").append(`<option value="">_____________________</option>`)
    load_parent_menu("select_parent_menu_add", null, "")
    $(`#select_represent_category_add`).empty()
    $("#select_represent_category_add").append(`<option value="">_____________________</option>`)
    load_parent_category("select_represent_category_add", null, "")
    $("#popupAddMenu").modal({ backdrop: "static", keyboard: false })
}
function confirmAdd() {
    const name = $("#name_Menu_add").val()
    const link_add = $("#link_add").val()
    const display_app = $("#display_app_add").val()
    const display_website = $("#display_website_add").val()
    const display_tree = $("#display_tree_add").val()
    const display_home = $("#display_home_addd").val()
    const id_parent = $("#select_parent_menu_add").val()
    const id_represent_category = $("#select_represent_category_add").val()
    const serial_number = $("#serial_number_add").val()
    const image = $("#add_input_image_menu")[0].files[0]
    // const check_delete_image = $("#edit_image_menu_change").val()
    const icon = $("#add_input_icon_menu")[0].files[0]
    // const check_delete_icon = $("#edit_icon_menu_change").val()
    var data = new FormData()
    data.append(`name`, name)
    data.append(`link`, link_add)
    data.append(`id_parent`, id_parent)
    data.append(`id_represent_category`, id_represent_category)
    data.append(`serial_number`, serial_number)
    data.append(`display_app`, display_app)
    data.append(`display_website`, display_website)
    data.append(`display_tree`, display_tree)
    data.append(`display_home`, display_home)
    data.append(`image`, image)
    // data.append(`check_delete_image`, check_delete_image)
    data.append(`icon`, icon)
    // data.append(`check_delete_icon`, check_delete_icon)
    hidePopup("popupAddMenu")
    callAPI(
        "POST",
        API_MENU,
        data,
        () => {
            success("Thành công")
            getData()
        },
        undefined,
        true,
        true
    )
}
function change_serial_number(_id, input) {
    const serial_number = tryParseInt($(input).val().trim())
    var data = {
        _id: _id,
        serial_number: serial_number,
    }
    callAPI(
        "PUT",
        API_MENU,
        data,
        () => {
            // success("Thành công")
            // getData()
        },
        false,
        false
    )
}
//
function load_parent_menu(id_div_select, _id, text = "") {
    DATA_ALL_MENU.forEach((element) => {
        text = text.replace("|_", "")
        if (element["id_parent"] + "" == _id + "") {
            $(`#${id_div_select}`).append(`<option value="${element["_id"]}">${text}${element["name"]}</option>`)
            // console.log(text)
            load_parent_menu(id_div_select, element["_id"], text + "&emsp;.&emsp;|_&nbsp;")
        }
    })
}
function load_parent_category(id_div_select, _id, text = "") {
    // console.log(DATA_ALL_CATEGORY)
    DATA_ALL_CATEGORY.forEach((element) => {
        // text+='-'
        if (element["id_parent_category"] + "" == _id + "") {
            $(`#${id_div_select}`).append(`<option value="${element["_id"]}">${text}${element["category_name"]}</option>`)
            load_parent_category(id_div_select, element["_id"], text + "--")
        }
    })
}

function changeShow(input) {
    if ($(input).is(":checked")) {
        $(input).val(true)
    } else {
        $(input).val(false)
    }
}

function showImageEdit(input, id_tag_img, id_change) {
    $(`#${id_change}`).val(0)
    if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
            $(`#${id_tag_img}`).attr("src", e.target.result)
        }
        reader.readAsDataURL(input.files[0]) // convert to base64 string
        $(`#${id_change}`).val(0)
    }
}
//delete this image
function delete_curent_image(id_change, id_tag_img, id_input_img) {
    $(`#${id_tag_img}`).attr("src", "")
    $(`#${id_change}`).val(1)
    $(`#${id_input_img}`).val(null)
}
