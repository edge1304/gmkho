const FIXED_LIMIT = 10
var page = 1
var arrData = []
function getData() {
    // console.log(`??????`)
    callAPI("GET", `${API_WEBSITE_COMPONENT}`, null, (data) => {
        throwValue(data)
        loadData(data.data)
    })
}

function loadData(data) {
    $("#ul_website_component_1").empty()
    arrData = []
    if (isDefine(data)) {
        for (let i = 0; i < data.length; i++) {
            arrData.push(data[i])
            let ul = "#ul_website_component_1"
            if (data[i].MenuName == "laptop") ul = "#ul_website_component_1"
            // if (data[i].MenuName == "accessories") ul = "#ul_accessories"

            Object.keys(data[i].Content).map((key) => {
                $(ul).append(`
                <li class="list-group-item" onclick="editMenu(${i},'${key}')" style="cursor: pointer;">
                    <span>${data[i].Content[key].Description}</span>
                    <i onclick="editMenu(${i},'${key}')"  class="fas fa-edit"></i>
                </li>
            `)
            })
        }
    } else {
        info(`Không có dữ liệu`)
    }
}

function editMenu(index, key) {
    switch (key) {
        case `Title`: {
            $("#btn_Save_edit_Title").attr("onclick", `confirm_Save_Edit_Title(${index})`)
            $("#edit_Title").val(arrData[index].Content.Title.Content.Title)
            $($("#edit_Title").closest("div").find("img")[0]).attr("src", `${URL_IMAGE_WEBSITE_COMPONENT}/${arrData[index].Content.Title.Content.Image}`)
            $($("#edit_Title").closest("div").find("input[type=file]")[0]).val(null)
            showPopup("popup_Title")
            break
        }
        case `SEO_image`: {
            $("#btn_Save_edit_seo_img").attr("onclick", `confirm_Save_Edit_SEO_image(${index})`)
            $($("#div__input_seo_image").closest("div").find("img")[0]).attr("src", `${URL_IMAGE_WEBSITE_COMPONENT}/${arrData[index]?.Content?.SEO_image?.Content}`)
            $($("#div__input_seo_image").closest("div").find("input[type=file]")[0]).val(null)
            showPopup("popup_SEO_image")
            break
        }
        default:
            break
    }
}
//#region title
function confirm_Save_Edit_Title(index) {
    console.log(`?`)
    const _id = arrData[index]._id
    const title = $("#edit_Title").val().trim()
    if (title.length == 0) {
        info("Tiêu đề không được để trống")
        return
    }
    const image = $($($("#edit_Title").closest("div")).find("input[type=file]")[0])[0].files[0]
    var data = new FormData()
    data.append("_id", _id)
    data.append("title", title)
    data.append("image_title", image)
    hidePopup("popup_Title")
    callAPI(
        "PUT",
        `${API_WEBSITE_COMPONENT}/title`,
        data,
        () => {
            success("Thành công")
            getData()
        },
        undefined,
        true
    )
}
//#endregion title

//#region SEO_image
function confirm_Save_Edit_SEO_image(index) {
    const _id = arrData[index]._id
    const image = "#input_seo_image".files[0]
    var data = new FormData()
    data.append("_id", _id)
    data.append("image", image)
    hidePopup("popup_SEO_image")
    callAPI(
        "PUT",
        `${API_WEBSITE_COMPONENT}/seo-image`,
        data,
        () => {
            success("Thành công")
            getData()
        },
        undefined,
        true
    )
}
//#endregion SEO_image

//#region function
function changeImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
            $($($(input).closest("div")).find("img")[0]).attr("src", e.target.result)
        }
        reader.readAsDataURL(input.files[0]) // convert to base64 strin
    }
}
//#endregion function
