

var arrData = [];
getData()
function getData() {
    isLoading();
    callAPI('GET', `${API_BRANCH}?`, null, (data) => {
        drawTable(data)
    })
}

function drawTable(data) {
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
    arrData = []
    for (let i = 0; i < data.length; i++) {
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td class="center">${i + 1}</td>
                <td>${data[i].branch_name}</td>
                <td>${data[i].branch_phone}</td>
                <td class="text-center">${data[i].branch_logo == null ? "" : `<img src="${URL_IMAGE_BRANCH}${data[i].branch_logo}">`}</td>
                <td class="text-center">${data[i].branch_image == null ? "" : `<img src="${URL_IMAGE_BRANCH}${data[i].branch_image}">`}</td>
                <td class="text-center">
                    <button onclick="editBranch(${i})" class="btn btn-primary"><i class="mdi mdi-tooltip-edit">Chỉnh sửa</i></button>
                </td>
            </tr>
        `)
    }
    dataTable(null, false)
}

function editBranch(index) {
    const in_morning = `${addZero(arrData[index].in_morning.hours)}:${addZero(arrData[index].in_morning.minutes)}`
    const out_morning = `${addZero(arrData[index].out_morning.hours)}:${addZero(arrData[index].out_morning.minutes)}`
    const in_afternoon = `${addZero(arrData[index].in_afternoon.hours)}:${addZero(arrData[index].in_afternoon.minutes)}`
    const out_afternoon = `${addZero(arrData[index].out_afternoon.hours)}:${addZero(arrData[index].out_afternoon.minutes)}`


    const in_noon_schedule = `${addZero(arrData[index].in_noon_schedule.hours)}:${addZero(arrData[index].in_noon_schedule.minutes)}`
    const out_noon_schedule = `${addZero(arrData[index].out_noon_schedule.hours)}:${addZero(arrData[index].out_noon_schedule.minutes)}`
    const out_night_schedule = `${addZero(arrData[index].out_night_schedule.hours)}:${addZero(arrData[index].out_night_schedule.minutes)}`
    const in_night_schedule = `${addZero(arrData[index].in_night_schedule.hours)}:${addZero(arrData[index].in_night_schedule.minutes)}`

    $("#in_morning_edit").val(in_morning)
    $("#out_morning_edit").val(out_morning)
    $("#in_afternoon_edit").val(in_afternoon)
    $("#out_afternoon_edit").val(out_afternoon)

    $("#in_noon_schedule_edit").val(in_noon_schedule)
    $("#out_noon_schedule_edit").val(out_noon_schedule)
    $("#in_night_schedule_edit").val(in_night_schedule)
    $("#out_night_schedule_edit").val(out_night_schedule)

    $("#ipwifi_edit").val(arrData[index].branch_ipwifi)
    $("#late_limit_edit").val(arrData[index].late_limit)

    $("#editName").val(arrData[index].branch_name)
    $("#editPhone").val(arrData[index].branch_phone)
    $("#editHeader").val(arrData[index].branch_header_content)
    $("#editNote").val(arrData[index].branch_note)
    $("#editAddress").val(arrData[index].branch_address)

    $("#map_address_edit").val(arrData[index].branch_map_address)
    $("#email_edit").val(arrData[index].branch_email)
    $("#time_active_edit").val(arrData[index].branch_time_active)
    
    $("#inputEditLogo").val(null)
    $("#inputEditImage").val(null)

    if (!arrData[index].branch_logo) {
        $(`#logoEdit`).css({ "height": "200px" })
        $("#logoEdit").attr("src", IMAGE_NULL)
        $(`#imageEdit`).css({ "height": "200px" })
        $("#imageEdit").attr("src", IMAGE_NULL)
    }
    else {
        $(`#logoEdit`).css({ "height": "auto" })
        $("#logoEdit").attr("src", URL_IMAGE_BRANCH + arrData[index].branch_logo)

        $(`#imageEdit`).css({ "height": "auto" })
        $("#imageEdit").attr("src", URL_IMAGE_BRANCH + arrData[index].branch_image)

    }
    $("#confirmEdit").attr("onclick", `confirmEdit(${index})`)
    showPopup('popupEdit')
}

function changeImage(input) {
    $(`#${input}`).click()
}

function paste_Image(input, image) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(`#${image}`).css({ "height": "auto" })
            $(`#${image}`).attr("src", e.target.result)
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}


function confirmEdit(index) {
    const branch_name = $("#editName").val().trim()
    const branch_phone = $("#editPhone").val().trim()
    const branch_address = $("#editAddress").val().trim()
    const branch_logo = $("#inputEditLogo")[0].files[0];
    const branch_image = $("#inputEditImage")[0].files[0];
    const branch_header_content = $("#editHeader").val().trim()
    const branch_note = $("#editNote").val().trim()
    const branch_ipwifi = $("#ipwifi_edit").val().trim()
    const late_limit = tryParseInt($("#late_limit_add").val())

    const branch_map_address = $("#map_address_edit").val().trim()
    const branch_email = $("#email_edit").val().trim()
    const branch_time_active = $("#time_active_edit").val().trim()

    if (branch_name.length == 0) {
        info("Tên chi nhánh không được để trống!")
        return;
    }
    if (typeof branch_logo != 'undefined' && branch_logo.size > MAX_SIZE_IMAGE) {
        info("Ảnh logo có kích thước quá lớn, sẽ ảnh hưởng đến việc in phiếu.")
        return
    }
    const in_morning = new Date("1999-12-24 " + $("#in_morning_edit").val())
    const out_morning = new Date("1999-12-24 " + $("#out_morning_edit").val())
    const in_afternoon = new Date("1999-12-24 " + $("#in_afternoon_edit").val())
    const out_afternoon = new Date("1999-12-24 " + $("#out_afternoon_edit").val())

    const in_noon_schedule = new Date("1999-12-24 " + $("#in_noon_schedule_edit").val())
    const out_noon_schedule = new Date("1999-12-24 " + $("#out_noon_schedule_edit").val())
    const out_night_schedule = new Date("1999-12-24 " + $("#out_night_schedule_edit").val())
    const in_night_schedule = new Date("1999-12-24 " + $("#in_night_schedule_edit").val())

    const data = new FormData()
    data.append(`branch_map_address`,branch_map_address)
    data.append(`branch_email`,branch_email)
    data.append(`branch_time_active`,branch_time_active)

    data.append('branch_logo', branch_logo)
    data.append('branch_phone', branch_phone)
    data.append('branch_address', branch_address)
    data.append('branch_image', branch_image)
    data.append('branch_name', branch_name)
    data.append('branch_header_content', branch_header_content)
    data.append('branch_note', branch_note)
    data.append('id_branch', arrData[index]._id)
    data.append('branch_ipwifi', branch_ipwifi)
    data.append('late_limit', tryParseInt(late_limit))
    data.append('in_morning', JSON.stringify({ hours: tryParseInt(in_morning.getHours()), minutes: tryParseInt(in_morning.getMinutes()), seconds: 0 }))
    data.append('out_morning', JSON.stringify({ hours: tryParseInt(out_morning.getHours()), minutes: tryParseInt(out_morning.getMinutes()), seconds: 0 }))
    data.append('in_afternoon', JSON.stringify({ hours: tryParseInt(in_afternoon.getHours()), minutes: tryParseInt(in_afternoon.getMinutes()), seconds: 0 }))
    data.append('out_afternoon', JSON.stringify({ hours: tryParseInt(out_afternoon.getHours()), minutes: tryParseInt(out_afternoon.getMinutes()), seconds: 0 }))
    data.append('in_noon_schedule', JSON.stringify({ hours: tryParseInt(in_noon_schedule.getHours()), minutes: tryParseInt(in_noon_schedule.getMinutes()), seconds: 0 }))
    data.append('out_noon_schedule', JSON.stringify({ hours: tryParseInt(out_noon_schedule.getHours()), minutes: tryParseInt(out_noon_schedule.getMinutes()), seconds: 0 }))
    data.append('out_night_schedule', JSON.stringify({ hours: tryParseInt(out_night_schedule.getHours()), minutes: tryParseInt(out_night_schedule.getMinutes()), seconds: 0 }))
    data.append('in_night_schedule', JSON.stringify({ hours: tryParseInt(in_night_schedule.getHours()), minutes: tryParseInt(in_night_schedule.getMinutes()), seconds: 0 }))

    hidePopup('popupEdit')
    callAPI('put', `${API_BRANCH}`, data, (data) => {
        success("Thành công")
        getData()
    }, undefined, true)

}

function confirmAdd() {
    const branch_name = $("#addName").val().trim()
    const branch_phone = $("#addPhone").val().trim()
    const branch_address = $("#addAddress").val().trim()
    const branch_logo = $("#inputAddLogo")[0].files[0];
    const branch_image = $("#inputAddImage")[0].files[0];
    const branch_header_content = $("#addHeader").val().trim()
    const branch_note = $("#addNote").val().trim()
    const branch_map_address = $("#map_address_add").val().trim()
    const branch_email = $("#email_add").val().trim()
    const branch_time_active = $("#time_active_add").val().trim()


    const branch_ipwifi = $("#ipwifi_add").val().trim()
    const late_limit = tryParseInt($("#late_limit_add").val())
    const in_morning = new Date("1999-12-24 " + $("#in_morning_add").val())
    const out_morning = new Date("1999-12-24 " + $("#out_morning_add").val())
    const in_afternoon = new Date("1999-12-24 " + $("#in_afternoon_add").val())
    const out_afternoon = new Date("1999-12-24 " + $("#out_afternoon_add").val())

    const in_noon_schedule = new Date("1999-12-24 " + $("#in_noon_schedule_add").val())
    const out_noon_schedule = new Date("1999-12-24 " + $("#out_noon_schedule_add").val())
    const out_night_schedule = new Date("1999-12-24 " + $("#out_night_schedule_add").val())
    const in_night_schedule = new Date("1999-12-24 " + $("#in_night_schedule_add").val())


    if (branch_name.length == 0) {
        info("Tên chi nhánh không được để trống!")
        return;
    }
    if (typeof branch_logo != 'undefined' && branch_logo.size > MAX_SIZE_IMAGE) {
        info("Ảnh logo có kích thước quá lớn, sẽ ảnh hưởng đến việc in phiếu.")
        return
    }

    const data = new FormData()
    data.append('branch_logo', branch_logo)
    data.append('branch_phone', branch_phone)
    data.append('branch_address', branch_address)
    data.append('branch_image', branch_image)
    data.append('branch_name', branch_name)
    data.append('branch_header_content', branch_header_content)
    data.append('branch_note', branch_note)
    data.append(`branch_map_address`,branch_map_address)
    data.append(`branch_email`,branch_email)
    data.append(`branch_time_active`,branch_time_active)
    data.append('branch_ipwifi ', branch_ipwifi)
    data.append('late_limit', tryParseInt(late_limit))
    data.append('in_morning', JSON.stringify({ hours: tryParseInt(in_morning.getHours()), minutes: tryParseInt(in_morning.getMinutes()), seconds: 0 }))
    data.append('out_morning', JSON.stringify({ hours: tryParseInt(out_morning.getHours()), minutes: tryParseInt(out_morning.getMinutes()), seconds: 0 }))
    data.append('in_afternoon', JSON.stringify({ hours: tryParseInt(in_afternoon.getHours()), minutes: tryParseInt(in_afternoon.getMinutes()), seconds: 0 }))
    data.append('out_afternoon', JSON.stringify({ hours: tryParseInt(out_afternoon.getHours()), minutes: tryParseInt(out_afternoon.getMinutes()), seconds: 0 }))
    data.append('in_noon_schedule', JSON.stringify({ hours: tryParseInt(in_noon_schedule.getHours()), minutes: tryParseInt(in_noon_schedule.getMinutes()), seconds: 0 }))
    data.append('out_noon_schedule', JSON.stringify({ hours: tryParseInt(out_noon_schedule.getHours()), minutes: tryParseInt(out_noon_schedule.getMinutes()), seconds: 0 }))
    data.append('out_night_schedule', JSON.stringify({ hours: tryParseInt(out_night_schedule.getHours()), minutes: tryParseInt(out_night_schedule.getMinutes()), seconds: 0 }))
    data.append('in_night_schedule', JSON.stringify({ hours: tryParseInt(in_night_schedule.getHours()), minutes: tryParseInt(in_night_schedule.getMinutes()), seconds: 0 }))



    hidePopup('popupAdd')
    callAPI('post', `${API_BRANCH}`, data, (data) => {
        success("Thành công")
        getData()
    }, undefined, true)

}
