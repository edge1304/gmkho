var arrData = []
var id_user = null
getData()

function getData() {
    key = $("#keyFind").val()
    limit = $("#selectLimit option:selected").val()
    debt = $("#selectDebt option:selected").val( )
    callAPI('GET', API_DEBT, {
        key: key,
        limit: limit,
        page: page,
        debt:debt
    }, data => {
        drawTable(data.data)
        pagination(data.count, data.data.length)
        changeURL(`?limit=${limit}&page=${page}&key=${key}&debt=${debt}`)
    })
}

function drawTable(data) {

    arrData = []
    $("#tbodyTable").empty()
    for (let i = 0; i < data.length; i++){
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td>${stt + i}</td>
                <td>${data[i].user_fullname}</td>
                <td>${data[i].total_debt < 0 ? `(${money(data[i].total_debt * -1)})` : money(data[i].total_debt)}</td>
                <td><i class="fas fa-info text-primary" onclick="showDetail(${i})"></i></td>
            </tr>
        `)

    }
}
function selectSupplier(index) {
    $($(event.path[0]).closest('div')).empty()
    $("#div_find_supplier input").val(arrSupplier[index].user_fullname)
    $("#div_find_supplier input").attr("name", arrSupplier[index]._id)
    id_user = arrSupplier[index]._id
    $("#popupAdd input[name=info]").val(`SĐT: ${arrSupplier[index].user_phone} - Địa chỉ: ${arrSupplier[index].user_address}`)
   
}

function confirmSave() {
    if (!id_user) {
        info("Khách hàng không được để trống")
        return
    }
    const debt_type = $("#popupAdd input[type=radio]:checked").val()
    const debt_money = tryParseInt($("#popupAdd input[name=debt_money]").val())
    const debt_note = $("#popupAdd input[name=note]").val()

    hidePopup('popupAdd')
    callAPI('POST', API_DEBT, {
        debt_type: debt_type,
        debt_money: debt_money,
        debt_note: debt_note,
        id_user:id_user
    }, data => {
        success("Thành công")
        getData()
    })
}

function showDetail(index) {
    $($("#popupSelectTime input[type=date]")[0]).val(getTime().startMonth)
    $($("#popupSelectTime input[type=date]")[1]).val(getTime().current)
    $("#popupSelectTime .modal-footer button:last-child()").attr("onclick",`getDetailReport(${index})`)
    showPopup('popupSelectTime')   
}

function getDetailReport(index) {
    const fromdate = $($("#popupSelectTime input[type=date]")[0]).val()
    const todate = $($("#popupSelectTime input[type=date]")[1]).val()
    if (new Date(fromdate) == 'Invalid Date' || new Date(todate) == 'Invalid Date') {
        info("Hãy chọn thời gian phù hợp")
        return
    }
    
    hidePopup('popupSelectTime')
    callAPI('GET', `${API_DEBT}/report`, {
        id_user: arrData[index]._id,
        fromdate: fromdate,
        todate:todate
    }, data => {

        $("#popupDetail .modal-body").empty()
        $("#popupDetail .modal-body").html(`
            <table id="tableDetail" class="table table-hover">
                <thead>
                    <tr>
                        <th rowspan="2">STT</th>
                        <th rowspan="2">Ngày tạo</th>
                        <th rowspan="2">Chứng từ</th>
                        <th class="center" colspan="3">Nội dung</th>
                        <th rowspan="2">Phải thu</th>
                        <th rowspan="2">Đã thu</th>
                        <th rowspan="2">Phải chi</th>
                        <th rowspan="2">Đã chi</th>
                        <th rowspan="2">Tổng nợ</th>
                        <th rowspan="2">Nợ cuối</th>
                    </tr>
                    <tr>    
                        <th rowspan="1" colspan="1">Tên hàng</th>
                        <th rowspan="1" colspan="1">ĐVT</th>
                        <th rowspan="1" colspan="1">Số lượng</th>
                    </tr>
                </thead>
                <tbody></tbody>
                <tfoot></tfoot>
            </table>
        `)
        let final_debt = 0
        for (let i = 0; i < data.periodDebt.length; i++){
            final_debt += data.periodDebt[i].total_period
            $("#popupDetail tbody").append(`
                <tr>
                    <td>0</td>
                    <td>_</td>
                    <td>_</td>
                    <td>Tồn đầu kỳ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${money(data.periodDebt[i].total_period)}</td>
                    <td>${money(final_debt)}</td>
                </tr>
            `)
            
        }

        for (let i = 0; i < data.currentDebt.length; i++){
          
            final_debt += calculateDebt(data.currentDebt[i])
            $("#popupDetail tbody").append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${formatDate(data.currentDebt[i].createdAt).fulldatetime}</td>
                    <td>${data.currentDebt[i].id_form?data.currentDebt[i].id_form:""}</td>
                    ${getHtmlContent(data.currentDebt[i])}
                    <td>${money(data.currentDebt[i].debt_money_export)}</td>
                    <td>${money(data.currentDebt[i].debt_money_receive)}</td>
                    <td>${money(data.currentDebt[i].debt_money_import)}</td>
                    <td>${money(data.currentDebt[i].debt_money_payment)}</td>
                    <td>${ calculateDebt(data.currentDebt[i]) < 0?`(${calculateDebt(data.currentDebt[i])*-1})`: money(calculateDebt(data.currentDebt[i])) }</td>
                    <td>${money(final_debt)}</td>
                </tr>
            `)
        }
        $("#popupDetail tfoot").append(`
                <tr>
                    <td>Tổng nợ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${money(final_debt)}</td>
                </tr>
            `)
        dataTable('tableDetail')
        showPopup('popupDetail')
    })
}

function getHtmlContent(data) {
    let html = ""
    
    if (data.debt_type == "export" && data.content_debt) {
        const arrDataProduct = []
        for (let i = 0; i < data.content_debt.export_form_product.length; i++){
            arrDataProduct.push(data.content_debt.export_form_product[i])
        }
        for (let i = 0; i < arrDataProduct.length; i++){
            for (let j = i + 1; j < arrDataProduct.length; j++){
                if (arrDataProduct[i].id_subcategory == arrDataProduct[j].id_subcategory) {
                    arrDataProduct[i].product_quantity += arrDataProduct[j].product_quantity 
                    arrDataProduct.splice(j, 1)
                    j--
                }
            }
        }
        
        html = '<td>'
        let htmlNumber = '<td>'
        let htmlUnit = '<td>'
        for (let i = 0; i <arrDataProduct.length; i++){
            html += `
                <span class="substring" title="${arrDataProduct[i].subcategory_name}">${arrDataProduct[i].subcategory_name}</span>
            `
            htmlNumber += `<span>${arrDataProduct[i].product_quantity}</span>`
            htmlUnit += `<span>Chiếc</span>`
        }
        htmlNumber += `</td>`
        htmlUnit+= `</td>`
        html += '</td>' + htmlUnit + htmlNumber
    }
    if (data.debt_type == "import" && data.content_debt) {
        const arrDataProduct = []
        for (let i = 0; i < data.content_debt.import_form_product.length; i++){
            arrDataProduct.push(data.content_debt.import_form_product[i])
        }
        for (let i = 0; i < arrDataProduct.length; i++){
            for (let j = i + 1; j < arrDataProduct.length; j++){
                if (arrDataProduct[i].id_subcategory == arrDataProduct[j].id_subcategory) {
                    arrDataProduct[i].product_quantity += arrDataProduct[j].product_quantity 
                    arrDataProduct.splice(j, 1)
                    j--
                }
            }
        }
        
        html = '<td>'
        let htmlNumber = '<td>'
        let htmlUnit = '<td>'
        for (let i = 0; i <arrDataProduct.length; i++){
            html += `
            <span class="substring" title="${arrDataProduct[i].subcategory_name}">${arrDataProduct[i].subcategory_name}</span>
            `
            htmlNumber += `<span>${arrDataProduct[i].product_quantity}</span>`
            htmlUnit += `<span>Chiếc</span>`
        }
        htmlNumber += `</td>`
        htmlUnit+= `</td>`
        html += '</td>' + htmlUnit + htmlNumber
    }
    if ( (data.debt_type == "payment" || data.debt_type == "receive" ) && data.content_debt ) { 
        html = `<td>${data.content_debt}</td><td></td><td></td>`
    }
    if (data.debt_type == "period" ) { 
        html = `<td>Nhập công nợ đầu kỳ</td><td></td><td></td>`
    }
    return html
}