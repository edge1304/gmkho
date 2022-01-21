let hasGetUser = false;
const elementSelectGroup = $("select[name=selectGroup]");
const elementTable = $("#tbodyTable");

const renderData = (user, asset) => {
  if (!hasGetUser) {
    user.data.forEach(item => {
      elementSelectGroup.append(`<option value="${item._id}" selected>${item.employee_fullname}</option>`)
    })
    hasGetUser = true
  }
  elementTable.empty()
  asset.forEach((element, index) => {
    const startAt = new Date(element.asset_time)
    const now = new Date()

    const fee = Math.round(element.asset_price / element.asset_expiry) * Math.floor((now - startAt) / (1000 * 3600 * 24));

    elementTable.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${element.id_asset}</td>
                <td>${element.asset_name}</td>
                <td>${element.asset_position}</td>
                <td class="right">${(new Date(element.asset_time)).toLocaleDateString()}</td>
                <td class="right">${money(element.asset_price)}</td>
                <td class="right">${element.asset_expiry}</td>
                <td class="right">${money(fee)}</td>
                <td class="right">${money(element.asset_price - fee)}</td>
                <td>${element.id_employee}</td>
                <td>${element.asset_note}</td>
                <td><button onclick="showPopupEdit(${index + 1})" class="badge badge-info"><i class="mdi mdi-information"></i> Chi tiết</button></td>
            </tr>`)
  });
}

const getUser = () => $.ajax({
  type: 'GET',
  url: `/api/employee?`,
  headers: {
    token: ACCESS_TOKEN,
  },
  data: {
    limit: tryParseInt(limit),
    page: tryParseInt(page),
    key: key,
  },
  cache: false,
})
const getAsset = () => $.ajax({
  type: 'GET',
  url: `/api/asset?`,
  // url: apiURL.getAsset,
  headers: {
    token: ACCESS_TOKEN,
  },
  data: {
    limit: tryParseInt(limit),
    page: tryParseInt(page),
    key: key,
  },
  cache: false,
})

const getData = async (isLoad = true) => {
  isLoading(isLoad);

  limit = $("#selectLimit option:selected").val();
  key = $("#keyFind").val()

  try {
    const [user, asset] = await Promise.all([getUser(), getAsset()]);

    isLoading(false);
    renderData(user, asset);

  }
  catch (error) {
    isLoading(false);
    if (error.status == 503 || error.status == 502) info("Server bị ngắt kết nối , hãy kiểm tra lại mạng của bạn");
    if (error != null && error.status != 503 && error.status != 502)
      info(error.responseText);
  }
}

getData(true);