var arrData = []
checkPermission()
function checkPermission() {
    callAPI("GET", API_INVENTORY + "/checkPermission", null, (data) => {
        data.warehouses.map((warehouse) => {
            $("#selectWarehouse").append(`<option value="${warehouse._id}">${warehouse.warehouse_name}</option>`)
        })
        data.categories.map((category) => {
            $("#selectCategory").append(`<option value="${category._id}">${category.category_name}</option>`)
        })
        getData()
    })
}

function getData() {
    const fromdate = $("#fromdate").val()
    const todate = $("#todate").val()
    const id_warehouse = $("#selectWarehouse option:selected").val()

    callAPI(
        "GET",
        API_INVENTORY,
        {
            fromdate: fromdate,
            todate: todate,
            id_warehouse: id_warehouse,
        },
        (data) => {
            console.log(data)
            changeURL(`?fromdate=${fromdate}&todate=${todate}&id_warehouse=${id_warehouse}`)
            arrData = data
            changeCategory(arrData)
        }
    )
}

function changeCategory(data) {
    const inventory = $("#selectInventory option:selected").val()
    const category = $("#selectCategory option:selected").val()

    $("#divTable").html(`
        <table id="dataTable" class="table table-hover">
            <thead>
                <tr>
                    <th>Số tt</th>
                    <th>Tên sản phẩm</th>
                    <th>Tên danh mục</th>
                    <th>Tồn đầu</th>
                    <th>Giá trị tồn đầu</th>
                    <th>SL nhập</th>
                    <th>Giá trị nhập</th>
                    <th>Đã xuất</th>
                    <th>Giá trị xuất</th>
                    <th>Tồn cuối</th>
                    <th>Giá trị tồn</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `)
    stt = 1

    for (let i = 0; i < data.length; i++) {
        if (category && category.length > 0) {
            if (data[i].id_category == category) {
                if (inventory == "lt" && caculateInventory(data[i]) < 0) {
                    drawTable(data[i])
                } else if (inventory == "gt" && caculateInventory(data[i]) > 0) {
                    drawTable(data[i])
                } else if (inventory == "ne" && caculateInventory(data[i]) != 0) {
                    drawTable(data[i])
                } else if (inventory == "all") {
                    drawTable(data[i])
                }
            }
        } else {
            if (inventory == "lt" && caculateInventory(data[i]) < 0) {
                drawTable(data[i])
            } else if (inventory == "gt" && caculateInventory(data[i]) > 0) {
                drawTable(data[i])
            } else if (inventory == "ne" && caculateInventory(data[i]) != 0) {
                drawTable(data[i])
            } else if (inventory == "all") {
                drawTable(data[i])
            }
        }
    }
    dataTable()
}

function drawTable(data) {
    $("#divTable tbody").append(`
        <tr>
            <td>${stt++}</td>
            <td><span class="substring">${data.subcategory_name}</span></td>
            <td>${$(`#selectCategory option[value=${data.id_category}]`).text()}</td>
            <td>${money(data.quantity_import_period - data.quantity_export_period)}</td>
            <td>${money(data.money_import_period - data.money_import_of_export_period)}</td>
            <td>${money(data.quantity_import_current)}</td>
            <td>${money(data.money_import_current)}</td>
            <td>${money(data.quantity_export_current)}</td>
            <td>${money(data.money_export_current)}</td>
            <td>${money(caculateInventory(data))}</td>
            <td>${money(caculateMoneyInventory(data))}</td>
        </tr>
    `)
}

function caculateInventory(data) {
    return data.quantity_import_period - data.quantity_export_period + (data.quantity_import_current - data.quantity_export_current)
}

function caculateMoneyInventory(data) {
    return data.money_import_period - data.money_import_of_export_period + (data.money_import_current - data.money_import_of_export_current)
}

function changeDraw() {
    changeCategory(arrData)
}
