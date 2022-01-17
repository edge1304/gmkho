var arrData = [];
var getGroup = true;

getData()

function getData(isLoad = true) {
  isLoading(isLoading)

  limit = $("#selectLimit option:selected").val();
  key = $("#keyFind").val()

  $.ajax({
    type: 'GET',
    url: `../api/asset?`,
    headers: {
      token: ACCESS_TOKEN,
    },
    data: {
      limit: limit,
      page: page,
      key: key,
    },

    cache: false,
    success: function (data) {
      isLoading(false);
      // console.log("🚀 ~ file: index 4.js ~ line 26 ~ getData ~ data", data)

    },
    error: function (data) {
      isLoading(false);
      if (data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
      if (data != null && data.status != 503 && data.status != 502)
        info(data.responseText);

    }
  })
}



function drawTable(data) {
  $("#tbodyTable").empty()
  arrData = []
  for (let i = 0; i < data.length; i++) {
    arrData.push(data[i])
    $("#tbodyTable").append(`
            <tr>
                <td>${stt + i}</td>
                <td>${data[i].employee_fullname}</td>
                <td>${data[i].employee_phone}</td>
                <td>${data[i].employee_address}</td>
                <td>${data[i].employee_group_name}</td>
                <td>${data[i].employee_status ? "Đang hoạt động" : "Đã nghỉ"}</td>
                <td><button onclick="showPopupEdit(${i})" class="badge badge-info"><i class="mdi mdi-information"></i> Chi tiết</button></td>
            </tr>
        `)
  }
}
