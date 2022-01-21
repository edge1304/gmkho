var arrData = [];
var isEmployee = true
function getData()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/timekeeping?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            fromdate: $("#fromdate").val(),
            todate: $("#fromdate").val()
        },
        cache: false,
        success: function (data) {
            console.log("??")
            isLoading(false);
            drawTable(data);
            changeURL(`?fromdate=${$("#fromdate").val()}`)

            if(isEmployee)
            {
                for(let i =0;i<data.length;i++)
                {
                    $("#selectEmployee").append(`<option value="${data[i]._id}">${data[i].employee_fullname}</option>`)
                }
                isEmployee = false
            }
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
    $("#divTable").empty();
    $("#divTable").html(`
    <table id="dataTable" class="table data">
        <thead>
            <tr>
            <th>Stt</th>
            <th>Tên nhân viên</th>
            <th>Số điện thoại</th>
            <th>Vào sáng</th>
            <th>Ra sáng</th>
            <th>Vào chiều</th>
            <th>Ra chiều</th>
            <th>Muộn sáng</th>
            <th>Muộn chiều</th>
            <th>Ngày công</th>
            <th>Chi tiết</th>
            </tr>
        </thead>
        <tbody id="tbodyTable"></tbody>
    </table>`)

    for(let i =0;i<data.length;i++)
    {
        if(data[i].data != null)
        {
            let in_morning = addZero(data[i].data.in_morning.hours)+":"+addZero(data[i].data.in_morning.minutes)+":"+addZero(data[i].data.in_morning.seconds)
            if(!isChecked(data[i].data.in_morning)) in_morning = "";
    
            let out_morning = addZero(data[i].data.out_morning.hours)+":"+addZero(data[i].data.out_morning.minutes)+":"+addZero(data[i].data.out_morning.seconds)
            if(!isChecked(data[i].data.out_morning)) out_morning = "";
    
            let in_afternoon = addZero(data[i].data.in_afternoon.hours)+":"+addZero(data[i].data.in_afternoon.minutes)+":"+addZero(data[i].data.in_afternoon.seconds)
            if(!isChecked(data[i].data.in_afternoon)) in_afternoon = "";
    
            let out_afternoon = addZero(data[i].data.out_afternoon.hours)+":"+addZero(data[i].data.out_afternoon.minutes)+":"+addZero(data[i].data.out_afternoon.seconds)
            if(!isChecked(data[i].data.out_afternoon)) out_afternoon = "";
    
            let late_morning = addZero(data[i].data.late_morning.hours)+" giờ "+ addZero(data[i].data.late_morning.minutes)+" phút"
            if(!isChecked(data[i].data.late_morning)) late_morning = "";
    
            let late_afternoon = addZero(data[i].data.late_afternoon.hours)+" giờ "+ addZero(data[i].data.late_afternoon.minutes)+" phút"
            if(!isChecked(data[i].data.late_afternoon)) late_afternoon = "";
    
            $("#tbodyTable").append(`<tr>
                <td class="center">${i+1}</td>
                <td >${data[i].employee_fullname}</td>
                <td>${data[i].employee_phone}</td>
                <td class="center">${in_morning}</td>
                <td class="center">${out_morning}</td>
                <td class="center">${in_afternoon}</td>
                <td class="center">${out_afternoon}</td>
                <td class="center">${late_morning}</td>
                <td class="center">${late_afternoon}</td>
                <td class="center">${achievement(data[i].data.in_morning,data[i].data.out_morning,data[i].data.in_afternoon, data[i].data.out_afternoon)}</td>
                <td></td>
            </tr>`)
        }
        else
        {
            $("#tbodyTable").append(`<tr>
                <td class="center">${i+1}</td>
                <td >${data[i].employee_fullname}</td>
                <td>${data[i].employee_phone}</td>
                <td class="center"></td>
                <td class="center"></td>
                <td class="center"></td>
                <td class="center"></td>
                <td class="center"></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>`)
        }
        
    }
    dataTable()
}

function showPopupDonwload()
{
    $("#fromdateReport").val(getTime().startMonth)
    $("#todateReport").val(getTime().current)
    showPopup('popupDownload')
}

function downloadReport()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/timekeeping/work/report?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            fromdate: $("#fromdateReport").val(),
            todate: $("#todateReport").val()
        },
        cache: false,
        success: function (data) {

            isLoading(false);
            for(let i =0;i<data.length;i++)
            {
                data[i].DayNumber = 0;
                data[i].LateNumber = 0
                data[i].OverTime = 0;
                data[i].Achievement = 0
                for(let j =0;j<data[i].data.length;j++)
                {
                    data[i].DayNumber ++;
                    data[i].Achievement += achievement(data[i].data[j].in_morning,data[i].data[j].out_morning,data[i].data[j].in_afternoon,data[i].data[j].out_afternoon)
                    data[i].OverTime += data[i].data[j].overtime.hours*60 + data[i].data[j].overtime.minutes
                    data[i].LateNumber = data[i].data[j].late_morning.hours*60 + data[i].data[j].late_morning.minutes + data[i].data[j].late_afternoon.hours*60 + data[i].data[j].late_afternoon.minutes
                    // console.log(data[i].data[j].late_morning.hours , data[i].data[j].late_morning.minutes,data[i].data[j].late_afternoon.hours,data[i].data[j].late_afternoon.minutes )
                }
            }
            var dataDownload = [];
            for(let i =0;i<data.length;i++)
            {
                dataDownload.push({
                    "Tên nhân viên":data[i].employee_fullname,
                    "Số điện thoại":data[i].employee_phone,
                    "Số ngày đi làm":data[i].DayNumber,
                    "Tăng ca (phút)":data[i].Overtime,
                    "Số công":data[i].Achievement,
                    "Tổng thời gian đi muộn (phút)":data[i].LateNumber,
                })
            }
            var opts = [{sheetid:'One',header:true},{sheetid:'Two',header:false}];
            var res = alasql('SELECT INTO XLSX("Báo cáo chấm công tháng.xlsx",?) FROM ?',
                             [opts,[dataDownload]]);
        
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
    $("#add_in_morning").val(null)
    $("#add_out_morning").val(null)
    $("#add_in_afternoon").val(null)
    $("#add_out_afternoon").val(null)
    showPopup('popupAdd')
}

function confirmAdd()
{

    
    const date_in_morning = $("#add_in_morning").val().length == 0?new Date($("#add_in_morning").val()):new Date(getTime().current+" "+ $("#add_in_morning").val())
    const in_morning = date_in_morning == 'Invalid Date'?{hours:0,minutes:0,seconds:0}:{hours:date_in_morning.getHours(), minutes:date_in_morning.getMinutes(), seconds:date_in_morning.getSeconds()}

    const date_out_morning =$("#add_out_morning").val().length == 0?new Date($("#add_out_morning").val()):new Date(getTime().current+" "+ $("#add_out_morning").val()) 
    const out_morning = date_out_morning == 'Invalid Date'?{hours:0,minutes:0,seconds:0}:{hours:date_out_morning.getHours(), minutes:date_out_morning.getMinutes(), seconds:date_out_morning.getSeconds()}
    
    const date_in_afternoon = $("#add_in_afternoon").val().length == 0?new Date($("#add_in_afternoon").val()):new Date(getTime().current+" "+ $("#add_in_afternoon").val()) 
    const in_afternoon = date_in_afternoon == 'Invalid Date'?{hours:0,minutes:0,seconds:0}:{hours:date_in_afternoon.getHours(), minutes:date_in_afternoon.getMinutes(), seconds:date_in_afternoon.getSeconds()}

    const date_out_afternoon = $("#add_out_afternoon").val().length == 0?new Date($("#add_out_afternoon").val()):new Date(getTime().current+" "+ $("#add_out_afternoon").val())
    const out_afternoon = date_out_afternoon == 'Invalid Date'?{hours:0,minutes:0,seconds:0}:{hours:date_out_afternoon.getHours(), minutes:date_out_afternoon.getMinutes(), seconds:date_out_afternoon.getSeconds()}

    if(date_in_morning == 'Invalid Date' && date_in_afternoon == 'Invalid Date')
    {
        info("Bắt buộc phải có giờ vào")
        return;
    }
    hidePopup('popupAdd')

    isLoading();
    $.ajax({
        type: 'POST',
        url: `../api/timekeeping/admin`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            in_morning:in_morning,
            out_morning:out_morning,
            in_afternoon:in_afternoon,
            out_afternoon:out_afternoon,
            id_employee: $("#selectEmployee option:selected").val(),
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