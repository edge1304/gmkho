// let hasGetUser = false;
// const elementSelectGroup = $("select[name=selectGroup]");
// const elementTable = $("#tbodyTable");

// const renderData = (user, asset) => {
//   if (!hasGetUser) {
//     user.data.forEach(item => {
//       elementSelectGroup.append(`<option value="${item._id}" selected>${item.employee_fullname}</option>`)
//     })
//     hasGetUser = true
//   }
//   elementTable.empty()
//   asset.forEach((element, index) => {
//     const startAt = new Date(element.asset_time)
//     const now = new Date()

//     const fee = Math.round(element.asset_price / element.asset_expiry) * Math.floor((now - startAt) / (1000 * 3600 * 24));

//     elementTable.append(`
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${element.id_asset}</td>
//                 <td>${element.asset_name}</td>
//                 <td>${element.asset_position}</td>
//                 <td class="right">${(new Date(element.asset_time)).toLocaleDateString()}</td>
//                 <td class="right">${money(element.asset_price)}</td>
//                 <td class="right">${element.asset_expiry}</td>
//                 <td class="right">${money(fee)}</td>
//                 <td class="right">${money(element.asset_price - fee)}</td>
//                 <td>${element.id_employee}</td>
//                 <td>${element.asset_note}</td>
//                 <td><button onclick="showPopupEdit(${index + 1})" class="badge badge-info"><i class="mdi mdi-information"></i> Chi tiết</button></td>
//             </tr>`)
//   });
// }

// const getUser = () => $.ajax({
//   type: 'GET',
//   url: `/api/employee?`,
//   headers: {
//     token: ACCESS_TOKEN,
//   },
//   data: {
//     limit: tryParseInt(limit),
//     page: tryParseInt(page),
//     key: key,
//   },
//   cache: false,
// })
// const getAsset = () => $.ajax({
//   type: 'GET',
//   url: `/api/asset?`,
//   // url: apiURL.getAsset,
//   headers: {
//     token: ACCESS_TOKEN,
//   },
//   data: {
//     limit: tryParseInt(limit),
//     page: tryParseInt(page),
//     key: key,
//   },
//   cache: false,
// })

// const getData = async (isLoad = true) => {
//   isLoading(isLoad);

//   limit = $("#selectLimit option:selected").val();
//   key = $("#keyFind").val()

//   try {
//     const [user, asset] = await Promise.all([getUser(), getAsset()]);

//     isLoading(false);
//     renderData(user, asset);

//   }
//   catch (error) {
//     isLoading(false);
//     if (error.status == 503 || error.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
//     if (error != null && error.status != 503 && error.status != 502)
//       info(error.responseText);
//   }
// }

// getData(true);

// function confirmAdd() {
//   // const employee_fullname = $("#addName").val().trim()
//   // const employee_phone = $("#addPhone").val().trim()
//   // const employee_address = $("#addAddress").val().trim()
//   // const employee_bank_number = $("#addBanknumber").val().trim()
//   // const employee_bank_name = $("#addBankname").val().trim()
//   // const id_employee_group = $("#addSelectGroup option:selected").val().trim()
//   // const employee_level = $("#addLevel").val().trim()
//   // const employee_salary = tryParseInt($("#addSalary").val())
//   // const employee_salary_duty = tryParseInt($("#addSalaryDuty").val())
//   // const employee_lunch_allowance = tryParseInt($("#addLunchAllowance").val())
//   // const password = $("#addPassword").val().trim().length == 0 ? null : sha512($("#addPassword").val().trim())
//   // const employee_revenue_percent = isNaN(parseFloat($("#addPercent").val())) ? 0 : parseFloat($("#addPercent").val())
//   // const employee_status =  $(`input[type=radio][name=addStatus]:checked`).val()
//   const id_user = $("#addAssetUser").val()
//   console.log("🚀 ~ file: index.js ~ line 103 ~ confirmAdd ~ id_user", id_user)
//   // const employee_image = $("#inputAddImage")[0].files[0];
//   // if (!employee_fullname) {
//   //   info("Tên nhân viên không được để trống")
//   //   return
//   // }
//   // if (!employee_phone) {
//   //   info("Số điện thoại")
//   //   return
//   // }
//   // var data = new FormData()
//   // data.append('employee_fullname', employee_fullname)
//   // data.append('employee_phone', employee_phone)
//   // data.append('employee_address', employee_address)
//   // data.append('employee_bank_number', employee_bank_number)
//   // data.append('employee_bank_name', employee_bank_name)
//   // data.append('id_employee_group', id_employee_group)
//   // data.append('employee_level', employee_level)
//   // data.append('employee_salary', employee_salary)
//   // data.append('employee_salary_duty', employee_salary_duty)
//   // data.append('employee_lunch_allowance', employee_lunch_allowance)
//   // data.append('password', password)
//   // data.append('employee_revenue_percent', employee_revenue_percent)
//   // data.append('employee_image', employee_image)
//   // // data.append('employee_status',employee_status)

//   // hidePopup('popupAdd')
//   // isLoading();
//   // $.ajax({
//   //   type: 'post',
//   //   url: `../api/employee`,
//   //   headers: {
//   //     token: ACCESS_TOKEN,
//   //   },
//   //   data: data,
//   //   contentType: false,
//   //   caches: false,
//   //   processData: false,

//   //   success: function (data) {
//   //     isLoading(false);
//   //     success("Thành công")
//   //     getData()
//   //   },
//   //   error: function (data) {
//   //     isLoading(false);
//   //     if (data.status == 503 || data.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
//   //     if (data != null && data.status != 503 && data.status != 502)
//   //       info(data.responseText);

//   //   }
//   // })
// }