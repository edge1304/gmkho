var arrData = [];
function getData()
{
    isLoading();
    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val(),
    $.ajax({
        type: 'GET',
        url: `../api/branch?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            limit:tryParseInt(limit),
            page: tryParseInt(page),
            key: key

        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            drawTable(data.data);
            pagination(data.count,data.data.length)
            changeURL(`?limit=${limit}&page=${page}&key=${key}`)
        },
        error: function (data) {
            isLoading(false);
            if(data.status == 503 || data.status == 502) alert("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
            if(data!= null && data.status != 503 && data.status != 502)
                alert(data.responseText);
            
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
        let in_morning = `${addZero(data[i].in_morning.hours)}:${addZero(data[i].in_morning.minutes)}`
        let out_morning = `${addZero(data[i].out_morning.hours)}:${addZero(data[i].out_morning.minutes)}`
        let in_afternoon = `${addZero(data[i].in_afternoon.hours)}:${addZero(data[i].in_afternoon.minutes)}`
        let out_afternoon = `${addZero(data[i].out_afternoon.hours)}:${addZero(data[i].out_afternoon.minutes)}`
        $("#tbodyTable").append(`<tr><td class="center">${stt+i}</td><td>${data[i].branch_name}</td><td>${data[i].branch_phone}</td><td class="text-center">${in_morning}</td><td class="center">${out_morning}</td><td class="center">${in_afternoon}</td><td class="center">${out_afternoon}</td><td class="center">${data[i].late_limit} phút</td><td class="center">${data[i].branch_ipwifi}</td><td class="center"><i onclick="editBranch(${i})" class="mdi mdi-tooltip-edit"></i></td></tr>`)
    }
}

function editBranch(index)
{
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
    
    $("#name_branch_edit").val(arrData[index].branch_name)
    $("#phone_edit").val(arrData[index].branch_phone)
    $("#ipwifi_edit").val(arrData[index].branch_ipwifi)
    $("#late_limit_edit").val(arrData[index].late_limit)


    $("#btnConfirmEdit").attr("onclick",`confirmEdit(${index})`);
    showPopup('popupEdit')
}

function confirmEdit(index)
{
    const branch_name = $("#name_branch_edit").val().trim()
    const branch_phone= $("#phone_edit").val().trim()
    const branch_ipwifi = $("#ipwifi_edit").val().trim()
    const late_limit = tryParseInt($("#late_limit_edit").val())

    if(branch_name.length == 0)
    {
        warning("Tên chi nhánh không được để trống!")
        return
    }
    const in_morning = new Date("1999-12-24 "+$("#in_morning_edit").val())
    const out_morning = new Date("1999-12-24 "+$("#out_morning_edit").val())
    const in_afternoon = new Date("1999-12-24 "+$("#in_afternoon_edit").val())
    const out_afternoon = new Date("1999-12-24 "+$("#out_afternoon_edit").val())

    const in_noon_schedule= new Date("1999-12-24 "+$("#in_noon_schedule_edit").val())
    const out_noon_schedule= new Date("1999-12-24 "+$("#out_noon_schedule_edit").val())
    const out_night_schedule= new Date("1999-12-24 "+$("#out_night_schedule_edit").val())
    const in_night_schedule= new Date("1999-12-24 "+$("#in_night_schedule_edit").val())

    hidePopup('popupEdit');
    isLoading();
    $.ajax({
        type: 'PUT',
        url: `../api/branch`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            branch_name:branch_name,
            branch_phone:branch_phone,
            branch_ipwifi:branch_ipwifi,
            late_limit:tryParseInt(late_limit),

            in_morning:{hours:tryParseInt(in_morning.getHours()),minutes:tryParseInt(in_morning.getMinutes()),seconds:0},
            out_morning:{hours:tryParseInt(out_morning.getHours()),minutes:tryParseInt(out_morning.getMinutes()),seconds:0},
            in_afternoon:{hours:tryParseInt(in_afternoon.getHours()),minutes:tryParseInt(in_afternoon.getMinutes()),seconds:0},
            out_afternoon:{hours:tryParseInt(out_afternoon.getHours()),minutes:tryParseInt(out_afternoon.getMinutes()),seconds:0},

            in_noon_schedule:{hours:tryParseInt(in_noon_schedule.getHours()),minutes:tryParseInt(in_noon_schedule.getMinutes()),seconds:0},
            out_noon_schedule:{hours:tryParseInt(out_noon_schedule.getHours()),minutes:tryParseInt(out_noon_schedule.getMinutes()),seconds:0},
            out_night_schedule:{hours:tryParseInt(out_night_schedule.getHours()),minutes:tryParseInt(out_night_schedule.getMinutes()),seconds:0},
            in_night_schedule:{hours:tryParseInt(in_night_schedule.getHours()),minutes:tryParseInt(in_night_schedule.getMinutes()),seconds:0},
            
            id_branch:arrData[index]._id
        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            success("Chỉnh sửa thành công!")
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
    $("#in_morning_add").val(null)
    $("#out_morning_add").val(null)
    $("#in_afternoon_add").val(null)
    $("#out_afternoon_add").val(null)

    $("#in_noon_schedule_add").val(null)
    $("#out_noon_schedule_add").val(null)
    $("#in_night_schedule_add").val(null)
    $("#out_night_schedule_add").val(null)
    
    $("#name_branch_add").val(null)
    $("#phone_add").val(null)
    $("#ipwifi_add").val(null)
    $("#late_limit_add").val(0)

    showPopup('popupAdd')
}

function confirmAdd()
{
    const branch_name = $("#name_branch_add").val().trim()
    const branch_phone= $("#phone_add").val().trim()
    const branch_ipwifi = $("#ipwifi_add").val().trim()
    const late_limit = tryParseInt($("#late_limit_add").val())

    if(branch_name.length == 0)
    {
        warning("Tên chi nhánh không được để trống!")
        return
    }
    const in_morning = new Date("1999-12-24 "+$("#in_morning_add").val())
    const out_morning = new Date("1999-12-24 "+$("#out_morning_add").val())
    const in_afternoon = new Date("1999-12-24 "+$("#in_afternoon_add").val())
    const out_afternoon = new Date("1999-12-24 "+$("#out_afternoon_add").val())

    const in_noon_schedule= new Date("1999-12-24 "+$("#in_noon_schedule_add").val())
    const out_noon_schedule= new Date("1999-12-24 "+$("#out_noon_schedule_add").val())
    const out_night_schedule= new Date("1999-12-24 "+$("#out_night_schedule_add").val())
    const in_night_schedule= new Date("1999-12-24 "+$("#in_night_schedule_add").val())

    hidePopup('popupAdd');
    isLoading();
    $.ajax({
        type: 'POST',
        url: `../api/branch`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            branch_name:branch_name,
            branch_phone:branch_phone,
            branch_ipwifi:branch_ipwifi,
            late_limit:tryParseInt(late_limit),
            in_morning:{hours:tryParseInt(in_morning.getHours()),minutes:tryParseInt(in_morning.getMinutes()),seconds:0},
            out_morning:{hours:tryParseInt(out_morning.getHours()),minutes:tryParseInt(out_morning.getMinutes()),seconds:0},
            in_afternoon:{hours:tryParseInt(in_afternoon.getHours()),minutes:tryParseInt(in_afternoon.getMinutes()),seconds:0},
            out_afternoon:{hours:tryParseInt(out_afternoon.getHours()),minutes:tryParseInt(out_afternoon.getMinutes()),seconds:0},
            in_noon_schedule:{hours:tryParseInt(in_noon_schedule.getHours()),minutes:tryParseInt(in_noon_schedule.getMinutes()),seconds:0},
            out_noon_schedule:{hours:tryParseInt(out_noon_schedule.getHours()),minutes:tryParseInt(out_noon_schedule.getMinutes()),seconds:0},
            out_night_schedule:{hours:tryParseInt(out_night_schedule.getHours()),minutes:tryParseInt(out_night_schedule.getMinutes()),seconds:0},
            in_night_schedule:{hours:tryParseInt(in_night_schedule.getHours()),minutes:tryParseInt(in_night_schedule.getMinutes()),seconds:0},

        },
      
        cache: false,
        success: function (data) {
            isLoading(false);
            success("Thêm mới thành công")
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