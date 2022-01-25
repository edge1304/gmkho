let hasGetUser = false;
let users, assets;
const elementSelectUser = $("select[name=selectUser]");
const elementTable = $("#tbodyTable");


$("#addAssetTime").val(new Date().toISOString().slice(0, 10))

const rerenderTable = (users, assets) => {
  if (!hasGetUser) {
    users.data.forEach(item => {
      elementSelectUser.append(`<option value="${item._id}" selected>${item.employee_fullname}</option>`)
    })
    hasGetUser = true
  }
  elementTable.empty()

  assets.forEach((element, index) => {
    const startAt = new Date(element.asset_time)
    const now = new Date()

    const numOfDayPassed = Math.floor((now - startAt) / (1000 * 60 * 60 * 24))
    const fee = Math.round(element.asset_price / element.asset_expiry) * Math.round(numOfDayPassed / 30)

    elementTable.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.id_asset}</td>
                <td>${element.asset_name}</td>
                <td>${element.asset_position}</td>
                <td class="right">${(new Date(element.asset_time)).toLocaleDateString()}</td>
                <td class="right">${money(element.asset_price)}</td>
                <td class="right">${element.asset_expiry}</td>
                <td class="right">${money(Math.min(fee, element.asset_price))}</td>
                <td class="right">${money(Math.max(element.asset_price - fee, 0))}</td>
                <td>${element.id_employee}</td>
                <td>${element.asset_note}</td>
                <td><button onclick="showPopupEdit(${index})" class="badge badge-info"><i class="mdi mdi-information"></i> Chi tiết</button></td>
            </tr>`)
  });
}

const showPopupEdit = (index) => {
  const user = users.data.find(ele => ele.employee_fullname === assets[index].id_employee)
  const asset = assets[index];
  // const asset = assets
  $("#editAssetUser").val(user._id).change()
  $("#editAssetTime").val(asset.asset_time.slice(0, 10))
  $("#editAssetExpiry").val(asset.asset_expiry)
  $("#editIdAsset").val(asset.id_asset)
  $("#editAssetName").val(asset.asset_name)
  $("#editAssetPosition").val(asset.asset_position)
  $("#editAssetPrice").val(asset.asset_price)
  $("#editAssetNote").val(asset.asset_note)

  // console.log("🚀 ~ file: index.js ~ line 58 ~ showPopupEdit ~ asset", `confirmEdit(${asset._id})`)
  $("#confirmEdit").attr("onclick", `confirmEdit(${index})`)
  showPopup('popupEdit')
}

const callAPI = {
  getUser: () => $.ajax({
    type: 'GET',
    url: `/api/employee?`,
    headers: {
      token: ACCESS_TOKEN,
    },
    data: {
      limit: 1000,
      page: 1,
      key: '',
    },
    cache: false,
  }),
  getAsset: () => $.ajax({
    type: 'GET',
    url: `/api/asset?`,
    headers: {
      token: ACCESS_TOKEN,
    },
    data: {
      limit: tryParseInt(limit),
      page: tryParseInt(page),
      key: key,
    },
    cache: false,
  }),
  createAsset: (data) => $.ajax({
    type: 'POST',
    url: `/api/asset?`,
    headers: {
      token: ACCESS_TOKEN,
    },
    data: data,
    cache: false,
  }),
  updateAsset: (data) => $.ajax({
    type: 'PUT',
    url: `/api/asset?`,
    headers: {
      token: ACCESS_TOKEN,
    },
    data: data,
    cache: false,
  }),
  // deleteAsset: (id) => $.ajax({
  //   type: 'DELETE',
  //   url: `/api/asset/${id}`,
  //   headers: {
  //     token: ACCESS_TOKEN,
  //   },
  //   cache: false,
  // }),
}

const getData = async (isLoad = true) => {
  isLoading(isLoad);

  limit = $("#selectLimit option:selected").val();
  key = $("#keyFind").val()

  try {
    [users, assets] = await Promise.all([callAPI.getUser(), callAPI.getAsset()]);

    isLoading(false);
    rerenderTable(users, assets);
    console.log("🚀 ~ file: index.js ~ line 127 ~ getData ~ assets", assets)
    pagination(10, assets.length)
  }
  catch (error) {
    isLoading(false);
    if (error.status == 503 || error.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
    if (error != null && error.status != 503 && error.status != 502)
      info(error.responseText);
  }
}

getData(true);

const confirmAdd = async () => {
  const id_user = $("#addAssetUser").val()
  const assetTime = $("#addAssetTime").val()
  const assetExpiry = $("#addAssetExpiry").val()
  const idAsset = $("#addIdAsset").val()
  const assetName = $("#addAssetName").val()
  const assetPosition = $("#addAssetPosition").val()
  const assetPrice = $("#addAssetPrice").val()
  const assetNote = $("#addAssetNote").val()
  if (!assetName) {
    info("Tên sản phẩm không được để trốngs")
    return
  }
  if (!idAsset) {
    info("Mã sản phẩm không được để trống")
    return
  }
  if (!assetExpiry) {
    info("Hạn sử dụng")
    return
  }
  const data = {
    'asset_name': assetName,
    'asset_position': assetPosition,
    'asset_price': assetPrice,
    'asset_expiry': assetExpiry,
    'asset_note': assetNote,
    'id_employee': id_user,
    'asset_time': assetTime,
    'id_asset': idAsset,
  }

  hidePopup('popupAdd')
  isLoading(true);
  try {
    await callAPI.createAsset(data)
    info("Thêm thành công")
    isLoading(false);
    getData(true);
  }
  catch (error) {
    isLoading(false);
    if (error.status == 503 || error.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
    if (error != null && error.status != 503 && error.status != 502)
      info(error.responseText);
  }
}
const confirmEdit = async (index) => {
  const id = assets[index]._id
  const id_user = $("#editAssetUser").val()
  const assetTime = $("#editAssetTime").val()
  const assetExpiry = $("#editAssetExpiry").val()
  const idAsset = $("#editIdAsset").val()
  const assetName = $("#editAssetName").val()
  const assetPosition = $("#editAssetPosition").val()
  const assetPrice = $("#editAssetPrice").val()
  const assetNote = $("#editAssetNote").val()
  if (!assetName) {
    info("Tên sản phẩm không được để trốngs")
    return
  }
  if (!idAsset) {
    info("Mã sản phẩm không được để trống")
    return
  }
  if (!assetExpiry) {
    info("Hạn sử dụng")
    return
  }
  const data = {
    '_id': id,
    'asset_name': assetName,
    'asset_position': assetPosition,
    'asset_price': assetPrice,
    'asset_expiry': assetExpiry,
    'asset_note': assetNote,
    'id_employee': id_user,
    'asset_time': assetTime,
    'id_asset': idAsset,
  }

  hidePopup('popupEdit')
  isLoading(true);
  try {
    await callAPI.updateAsset(data)
    info("Sửa thành công")
    isLoading(false);
    getData(true);
  }
  catch (error) {
    isLoading(false);
    if (error.status == 503 || error.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
    if (error != null && error.status != 503 && error.status != 502)
      info(error.responseText);
  }
}