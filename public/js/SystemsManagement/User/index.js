let users;
let usersExcel;

const elementSelectUser = $("select[name=selectUser]");
const elementTable = $("#tbodyTable");
const elementExcel = $("#tbodyAddExcel");


$("#addUserBirthday").val(new Date().toISOString().slice(0, 10))

const rerenderTable = (data) => {
  users = data.data;
  // console.table(data.data);
  elementTable.empty()

  data.data.forEach((element, index) => {

    elementTable.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.user_fullname}</td>
                <td>${element.user_phone}</td>
                <td>${element.user_address}</td>
                <td class="right">${element.user_birthday ? (new Date(element.user_birthday)).toLocaleDateString() : ''}</td>
                <td>${element.user_gender || ''}</td>
                <td>${element.user_point}</td>
                <td><button onclick="showPopupEdit(${index})" class="btn btn-primary"><i class="mdi mdi-information"></i> Chi tiết</button></td>
            </tr>`)
    pagination(data.count, data.data.length);
  });
}

const rerenderExcel = (data) => {
  elementExcel.empty()

  data.forEach((element, index) => {

    elementExcel.append(`
            <tr>
                <td>${index + 1}</td>
                <td class="text-capitalize">${element.user_fullname}</td>
                <td>${element.user_phone}</td>
                <td>${element.user_address}</td>
                <td class="right">${element.user_birthday ? element.user_birthday.toLocaleDateString() : ''}</td>
                <td class="text-capitalize">${element.user_gender}</td>
            </tr>`)
  })
}

const showPopupEdit = (index) => {
  const user = users[index];
  $("#editUserFullname").val(user.user_fullname)
  $("#editUserGender").val(user.user_gender)
  $("#editUserBirthday").val(user.user_birthday ? user.user_birthday.slice(0, 10) : null)
  $("#editUserPhone").val(user.user_phone)
  $("#editUserAddress").val(user.user_address)
  $("#editUserEmail").val(user.user_email)

  $("#confirmEdit").attr("onclick", `confirmEdit(${index})`)
  showPopup('popupEdit')
}

const getData = async (isLoad = true) => {

  const limit = $("#selectLimit option:selected").val();
  const key = $("#keyFind").val()

  const dataUser = {
    limit: tryParseInt(limit),
    page: tryParseInt(page),
    key: key,
  }

  callAPI('GET', API_USER, dataUser, rerenderTable)
  // isLoading(false);
}

const confirmAdd = async () => {
  try {
    const userFullname = $("#addUserFullname").val().trim()
    const userGender = $("#addUserGender").val()
    const userBirthday = $("#addUserBirthday").val()
    const userPhone = $("#addUserPhone").val().trim()
    const userAddress = $("#addUserAddress").val().trim()
    const userPassword = $("#addUserPassword").val()
    const userPassword2 = $("#addUserPassword2").val()
    const userEmail = $("#addUserEmail").val().trim()

    if (!userFullname) throw new Error('Vui lòng nhập họ tên')
    if (!userPhone) throw new Error('Vui lòng nhập số điện thoại')
    if (!userPassword) throw new Error('Vui lòng nhập mật khẩu')
    if (userPassword.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
    if (userPassword2 !== userPassword) throw new Error('Mật khẩu không khớp')
    if (userEmail !== '' && !validateEmail(userEmail)) throw new Error('Địa chỉ email không hợp lệ')

    const data = {
      'user_fullname': userFullname,
      'user_gender': userGender,
      'user_email': userEmail,
      'user_password': sha512(userPassword),
      'user_phone': userPhone,
      'user_birthday': userBirthday,
      'user_address': userAddress,
    }

    hidePopup('popupAdd')
    isLoading(true);
    callAPI('POST', `${API_USER}?`, data, () => {
      success("Thêm thành công");
      isLoading(false);
      getData(true);
    })
  }
  catch (error) {
    console.error(error.name + ': ' + error.message)
    warning(error.message);
  }
}

const confirmEdit = async (index) => {
  try {
    const id = users[index]._id
    const userFullname = $("#editUserFullname").val().trim()
    const userGender = $("#editUserGender").val()
    const userBirthday = $("#editUserBirthday").val()
    const userPhone = $("#editUserPhone").val().trim()
    const userAddress = $("#editUserAddress").val().trim()
    const userPassword = $("#editUserPassword").val()
    const userPassword2 = $("#editUserPassword2").val()
    const userEmail = $("#editUserEmail").val().trim()

    if (!userFullname) throw new Error("Vui lòng nhập họ tên")
    if (!userPhone) throw new Error("Vui lòng nhập số điện thoại")
    if (!userPassword) throw new Error("Vui lòng nhập mật khẩu")
    if (userPassword.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự")
    if (userPassword2 !== userPassword) throw new Error("Mật khẩu không khớp")
    if (userEmail !== '' && !validateEmail(userEmail)) throw new Error("Địa chỉ email không hợp lệ")

    const data = {
      '_id': id,
      'user_fullname': userFullname,
      'user_gender': userGender,
      'user_email': userEmail,
      'user_password': sha512(userPassword),
      'user_phone': userPhone,
      'user_birthday': userBirthday,
      'user_address': userAddress,
    }

    hidePopup('popupEdit')
    isLoading(true);
    callAPI('PUT', `${API_USER}?`, data, () => {
      success("Sửa thành công")
      isLoading(false);
      getData(true);
    })
  }

  catch (e) {
    console.error(e.name + ': ' + e.message)
    warning(e.message);
  }
}

getData(true);


// Excel
const downloadTemplate = () => {
  const template = [{
    "Tên khách hàng": "",
    "SĐT": "",
    "Địa chỉ": "",
    "Ngày sinh": "",
    "Giới tính": "",
  }]
  downloadExcelLocal(template, "Mẫu thêm khách hàng")
}

const selectInputFile = () => {
  $("#inputFile").val(null);
  $("#inputFile").click()
}

const readExcelFile = async (file) => {
  try {
    const data = await excelToJSON(file)
    usersExcel = []
    // console.table(data);

    if (data.length === 0) throw new Error("File excel không có dữ liệu")

    data.map(e => {
      const user = {
        'user_fullname': (e['Tên khách hàng'] || '').trim(),
        'user_phone': (e['SĐT'] || '').trim(),
        'user_email': (e['Email'] || '').trim(),
        'user_address': (e['Địa chỉ'] || '').trim(),
        'user_birthday': e['Ngày sinh'] ? new Date(e['Ngày sinh'].trim()) : '',
        'user_gender': (e['Giới tính'] || '').trim(),
      }
      if (user.user_fullname === '')
        throw new Error("Vui lòng nhập họ tên")
      if (user.user_phone === '')
        throw new Error("Vui lòng nhập số điện thoại")
      if (user.user_birthday == 'Invalid Date')
        throw new Error("Ngày sinh không hợp lệ (MM/DD/YYYY)")
      if (!['NAM', 'NỮ', ''].includes(user.user_gender.toUpperCase()))
        throw new Error("Giới tính không hợp lệ (Nam/Nữ)")

      usersExcel.push(user)
    })
    // console.table(usersExcel)

    showPopup('popupAddExcel')
    rerenderExcel(usersExcel)
  }
  catch (e) {
    console.error(e.name + ': ' + e.message)
    warning(e.message);
  }
}

const confirmAddExcel = async () => {
  try {
    callAPI('post', `${API_USER}/excel`, { listUser: usersExcel }, () => {
      success("Thêm thành công");
      isLoading(false);
      getData(true);
    })
    hidePopup('popupAddExcel')

  }
  catch (e) {
    console.error(e.name + ': ' + e.message)
    warning(e.message);
  }
}