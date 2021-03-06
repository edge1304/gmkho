getData()
function getData() {
    limit = $("#selectLimit option:selected").val()
    callAPI('GET', API_VOUCHER, {
        key: $("#keyFind").val().trim(),
        fromdate:$("#fromdate").val(),
        todate:$("#todate").val(),
        limit: limit,
        page:page
    }, data => {
        drawTable(data.data)
        pagination(data.count,data.data.length)
        changeURL(`?limit=${limit}&page=${page}&key=${key}&fromdate=${$("#fromdate").val()}&todate=${$("#todate").val()}`)
    })
}

function changeValueCheckbox() {
    const cbox = $(event.path[0])

    if ($(cbox).is(":checked")) {
        $(cbox).val("true")
        if ($(cbox).attr("id") == "voucher_is_limit_time") {
            $("#popupAdd input[type=datetime-local]").val(null)
            $("#popupAdd input[type=datetime-local]").prop("disabled",false)
        }
        else if($(cbox).attr("id") == "voucher_is_own") {
            $("#voucher_limit_user").val(1)
        }
    }
    else {
        $(cbox).val("false")
        if ($(cbox).attr("id") == "voucher_is_limit_time") {
            $("#popupAdd input[type=datetime-local]").prop("disabled", true)
            $("#popupAdd input[type=datetime-local]").val(null) 
        }
        
    }
}

function confirmAdd() {
    const voucher_type = $("#voucher_type option:selected").val()
    const voucher_value = tryParseInt($("#voucher_value").val())
    const voucher_limit_total = tryParseInt($("#voucher_limit_total").val())
    const voucher_limit_user = tryParseInt($("#voucher_limit_user").val())
    const voucher_time_end = $("#voucher_time_end").val()
    const voucher_time_start = $("#voucher_time_start").val()
    const voucher_is_limit_time = $("#voucher_is_limit_time").val()
    const voucher_is_own = $("#voucher_is_own").val()
    const voucher_description = $("#voucher_description").val()
    const voucher_quantity = tryParseInt($("#voucher_quantity").val())

    if (voucher_is_limit_time === 'true' && (voucher_time_end == '' || voucher_time_start == '')) {
        info("Gi???i h???n th???i gian kh??ng ph?? h???p")
        return
    }
    if (voucher_is_own === 'true' && voucher_limit_user != 1 ) {
        info("C?? th??? s??? h???u ch??? ??p d???ng s??? l???n = 1")
        return
    }
    if (voucher_quantity < 1) {
        info("S??? l?????ng m?? ph???i l???n h??n 0")
        return
    }
    if (voucher_value < 1) {
        info("S??? l?????ng m?? ph???i l???n h??n 0")
        return
    }
    hidePopup('popupAdd')
    callAPI('POST', API_VOUCHER, {
        voucher_type:voucher_type,
        voucher_value:voucher_value,
        voucher_limit_total:voucher_limit_total,
        voucher_limit_user:voucher_limit_user,
        voucher_time_end:voucher_time_end,
        voucher_time_start:voucher_time_start,
        voucher_is_limit_time:voucher_is_limit_time,
        voucher_is_own:voucher_is_own,
        voucher_quantity: voucher_quantity,
        voucher_description:voucher_description
    }, (datas) => {
        success("Th??nh c??ng!")
        getData()
        const arrDownload = []
        datas.map(voucher => {
            arrDownload.push({
                "M?? code": voucher.voucher_code,
                "H??nh th???c gi???m gi??": $(`#voucher_type option[value=${voucher.voucher_type}]`).text(),
                "Gi?? tr???": voucher.voucher_value,
                "S??? l???n ??p d???ng": voucher.voucher_limit_user,
                "Th???i gian b???t ?????u": voucher.voucher_time_end,
                "Th???i gian k???t th??c": voucher.voucher_time_start,
                "M?? t???": voucher.voucher_description,
            })
        })
        downloadExcelLocal(arrDownload,"Danh s??ch m?? gi???m gi??")
    })
}

function findData() {
    if (event.which == 13) {
        getData()
    }
}

function drawTable(data) {
 
    $("#tabodyTable").empty()
    for (let i = 0; i < data.length; i++){
        $("#tabodyTable").append(`
            <tr>
                <td>${stt+i}</td>
                <td>${data[i].voucher_code}</td>
                <td>${data[i].voucher_type=="money"?"Kho???ng ti???n":"%"}</td>
                <td>${ money(data[i].voucher_value)}</td>
                <td>${data[i].voucher_is_limit_time?formatDate(data[i].voucher_time_start).fulldatetime:""}</td>
                <td>${data[i].voucher_is_limit_time? formatDate(data[i].voucher_time_end).fulldatetime:""}</td>
                <td>${data[i].voucher_is_limit_time ? "C??" : "Kh??ng"} | ${data[i].voucher_is_own ? "C??" : "Kh??ng"}</td>
                <td class="right">${data[i].voucher_limit_user}</td>
                <td>${data[i].voucher_limit_user< 1?"???? d??ng h???t":"Ch??a d??ng"}</td>
            </tr>
        `)
    }
}