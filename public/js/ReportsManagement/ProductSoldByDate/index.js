checkPermission()

function checkPermission(){
    callAPI('GET',`${API_EXPORT}/revenue_product/checkPermission`,null, data =>{
        data.warehouses.map( warehouse =>{
            let isSelected = ""
            if(warehouse._id == id_warehouse) isSelected = "selected"
            $(".page-header .row div:nth-child(4) select").append(`<option ${isSelected} value="${warehouse._id}">${warehouse.warehouse_name}</option>`)
        })

        data.categories.map( category =>{
            let isSelected = ""
            if(category._id == id_category) isSelected = "selected"
            $(".page-header .row div:nth-child(3) select").append(`<option ${isSelected} value="${category._id}">${category.category_name}</option>`)
        })
    })
}


function getData(){
    const fromdate = $(".page-header .row div:nth-child(1) input").val()
    const todate = $(".page-header .row div:nth-child(2) input").val()
    const id_warehouse = $(".page-header .row div:nth-child(4) select option:selected").val()

    callAPI('GET',`${API_PRODUCT}/product_sold_by_date`,{
        fromdate:fromdate,
        todate:todate,
        id_warehouse:id_warehouse
    }, data =>{
        drawTable(data.dataExport, data.dataImportReturn)
    })
}

$(".page-header .row div:nth-child(5) button").click( e =>{
    getData()
})

function drawTable(dataExport, dataImport){

    let stt = 1
    $(".container-fluid .div-table").html(`
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Stt</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá xuất</th>
                    <th>Giá nhập</th>
                    <th>Lợi nhuận</th>
                    <th>% Lợi nhuận</th>
                    <th>Mã phiếu</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>
    `)
    let total_revenue = 0
    var index = 1

    for(let i =0;i<dataExport.length ;i++){
        const revenue = totalMoney(dataExport[i].product_export_price,0, dataExport[i].product_ck,dataExport[i].product_discount) - dataExport[i].product_import_price
        total_revenue += revenue
        $(".container-fluid .div-table tbody").append(`
            <tr>
                <td>${index++}</td>
                <td><span>${dataExport[i].id_product}</span></td>
                <td><span>${dataExport[i].subcategory_name}</span></td>
                <td><span>${money(dataExport[i].product_export_price)}</span></td>
                <td><span>${money(dataExport[i].product_import_price)}</span></td>
                <td><span>${money(revenue )}</span></td>
                <td><span>${calculate_revenue_percent(dataExport[i].product_import_price,totalMoney(dataExport[i].product_export_price,0, dataExport[i].product_ck,dataExport[i].product_discount))}</span></td>
                <td><a href="/export/print/${dataExport[i]._id}" target="_blank">Xuất: ${dataExport[i]._id}</a></td>
            </tr>
        `)
    }
    // dataImport[i].product_import_price  đây là giá nhập lại , còn return là giá nhập ban đầu
    for(let i =0;i<dataImport.length ;i++){
        const revenue = totalMoney(dataImport[i].product_export_price,0, dataImport[i].product_ck,dataImport[i].product_discount) - dataImport[i].product_import_price 
        total_revenue += revenue
        $(".container-fluid .div-table tbody").append(`
            <tr>
                <td>${index++}</td>
                <td><span>${dataImport[i].id_product}</span></td>
                <td><span>${dataImport[i].subcategory_name}</span></td>
                <td><span>${money(dataImport[i].product_export_price)}</span></td>
                <td><span>${money(dataImport[i].product_import_price)}</span></td>
                <td><span>${money(revenue)}</span></td>
                <td><span>${calculate_revenue_percent(dataImport[i].product_import_price,totalMoney(dataImport[i].product_export_price,0, dataImport[i].product_ck,dataImport[i].product_discount))}</span></td>
                <td><a href="/import/print/${dataImport[i]._id}" target="_blank">Nhập trả: ${dataImport[i]._id}</a></td>
            </tr>
        `)
    }
    $(".container-fluid .div-table tfoot").append(`
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>${money(total_revenue)}</td>
            <td></td>
            <td></td>
        </tr>
    `)

    dataTable2($(".container-fluid .div-table table"))
}

function calculate_revenue_percent(import_price, export_price){
   
    const money_revenue = export_price - import_price
    const percent = money_revenue == 0?0:(import_price/money_revenue).toFixed(2)
    return percent
}