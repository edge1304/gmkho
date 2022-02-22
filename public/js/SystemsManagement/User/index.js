let hasGetUser = false;
let employees;
const elementSelectUser = $("select[name=selectUser]");
const elementTable = $("#tbodyTable");


$("#addAssetTime").val(new Date().toISOString().slice(0, 10))

// const rerenderTable = (data) => {
//   employees = data;
//   if (!hasGetUser) {
//     data.data.forEach(item => {
//       elementSelectUser.append(`<option value="${item._id}">${item.employee_fullname}</option>`)
//     })
//     hasGetUser = true
//   }
// }
const rerenderTable = (data) => {
  employees = data;
  elementTable.empty()

  data.data.forEach((element, index) => {
    // const startAt = new Date(element.asset_time)
    // const now = new Date()

    // const numOfDayPassed = Math.floor((now - startAt) / (1000 * 60 * 60 * 24))
    // const fee = Math.max(
    //   Math.round(element.asset_price / element.asset_expiry) * Math.round(numOfDayPassed / 30), 0)

    elementTable.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.user_fullname}</td>
                <td>${element.user_phone}</td>
                <td>${element.user_address}</td>
                <td class="right">${(new Date(element.user_birthday)).toLocaleDateString()}</td>
                <td>${element.user_gender}</td>
                <td>${element.user_point}</td>
                <td><button onclick="showPopupEdit(${index})" class="btn btn-primary"><i class="mdi mdi-information"></i> Chi tiết</button></td>
            </tr>`)
    pagination(data.count, data.data.length);
  });
}

const showPopupEdit = (index) => {
  const employee = employees.data[index];
  console.log("🚀 ~ file: index.js ~ line 47 ~ showPopupEdit ~ employee", employee)
  // const user = employees.data.find(ele => ele.employee_fullname === asset.id_employee)
  // console.log("🚀 ~ file: index.js ~ line 49 ~ showPopupEdit ~ user", user)
  // console.log("🚀 ~ file: index.js ~ line 52 ~ showPopupEdit ~ users", users)
  // console.log("🚀 ~ file: index.js ~ line 51 ~ showPopupEdit ~ user", user._id)

  // $("#selectUser").val(user._id).change()
  // $("#editAssetTime").val(asset.asset_time.slice(0, 10))
  // $("#editAssetExpiry").val(asset.asset_expiry)
  // $("#editIdAsset").val(asset.id_asset)
  // $("#editAssetName").val(asset.asset_name)
  // $("#editAssetPosition").val(asset.asset_position)
  // $("#editAssetPrice").val(asset.asset_price)
  // $("#editAssetNote").val(asset.asset_note)
  $("#editUserFullname").val(employee.user_fullname)
  $("#editUserGender").val(employee.user_gender)
  $("#editUserBirthday").val(employee.user_birthday)
  $("#editUserPhone").val(employee.user_phone)
  $("#editUserAddress").val(employee.user_address)
  $("#editUserEmail").val(employee.user_email)

  $("#confirmEdit").attr("onclick", `confirmEdit(${index})`)
  showPopup('popupEdit')
}

const getData = async (isLoad = true) => {
  isLoading(isLoad);

  const limit = $("#selectLimit option:selected").val();
  const key = $("#keyFind").val()

  const dataUser = {
    limit: tryParseInt(limit),
    page: tryParseInt(page),
    key: key,
  }

  callAPI('GET', `${API_USER}?`, dataUser, rerenderTable)
  // isLoading(false);
}

const verifyInput = () => {
  const userFullname = $("#addUserFullname").val().trim()
  const userGender = $("#addUserGender").val()
  const userBirthday = $("#addUserBirthday").val()
  const userPhone = $("#addUserPhone").val().trim()
  const userAddress = $("#addUserAddress").val().trim()
  const userPassword = $("#addUserPassword").val()
  const userPassword2 = $("#addUserPassword2").val()
  const userEmail = $("#addUserEmail").val().trim()

  if (!userFullname) {
    warning("Vui lòng nhập họ tên")
    return
  }
  if (!userPassword) {
    warning("Vui lòng nhập mật khẩu")
    return
  }
  if (userPassword.length < 6) {
    warning("Mật khẩu phải có ít nhất 6 ký tự")
    return
  }
  if (userPassword2 !== userPassword) {
    warning("Mật khẩu không khớp")
    return
  }
  return {
    'user_fullname': userFullname,
    'user_gender': userGender,
    'user_email': userEmail,
    'user_password': sha512(userPassword),
    'user_phone': userPhone,
    'user_birthday': userBirthday,
    'user_address': userAddress,
  }
}

const confirmAdd = async () => {
  const data = verifyInput()
  if (!data) return

  console.log("🚀 ~ file: index.js ~ line 119 ~ confirmAdd ~ data", data)

  hidePopup('popupAdd')
  isLoading(true);
  callAPI('POST', `${API_USER}?`, data, () => {
    success("Thêm thành công");
    isLoading(false);
    getData(true);
  })
}

const confirmEdit = async (index) => {
  const id = employees.data[index]._id
  const data = verifyInput()

  hidePopup('popupEdit')
  isLoading(true);
  callAPI('PUT', `${API_ASSETS}?`, data, () => {
    success("Sửa thành công")
    isLoading(false);
    getData(true);
  })
}

getData(true);