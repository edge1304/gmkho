getData()
var arrData = []
var offsetCategory = 0;
var arrCartegory = []
var arrSuperCategory = []
function getData() {
    isLoading()
   
    limit = $("#selectLimit option:selected").val();
    key = $("#keyFind").val()
    $.ajax({
        type: 'GET',
        url: `../api/menu/admin?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: null,
        cache: false,
        success: function (data) {
            isLoading(false);
            drawTable(data)
        },
        error: function (data) {
            errAjax(data) 
        }
    })
}

function drawTable(data)
{
    arrData = []
    $("#tbodyTable").empty()
    for(let i = 0 ; i<data.length ;i++)
    {
        arrData.push(data[i])
        $("#tbodyTable").append(`
            <tr>
                <td class="center">${i+1}</td>
                <td>${data[i].menu_name}</td>
                <td class="center"><button onclick="editMenu(${i})" class="btn btn-danger">Chi tiết</button></td>
            </tr>
        `)
    }
}

function editMenu(index)
{
    
    if(arrData[index].menu_type == "Category")
    {
        drawMenuBuild(arrData[index].menu_content, index)
        showPopup('menuBuildCaseApp')
    }
   
}

function drawMenuBuild(data, index)
{
    $(`.spinner-border`).hide()
    $(".div-list-content").empty()
    for(let i =0;i<data.length;i++)
    {
        $(".div-list-content").append(`
            <tr>
                <td>${i+1}</td>
                <td>${data[i].category_name}</td>
                <td><i onclick="deleteContent(${i}, ${index})" class="mdi mdi-delete-forever"></i></td>
            </tr>
        `)
    }
    $("#btnSaveMenuSuperCategory").attr("onclick",`confirmSaveMenuSuperCategory(${index})`)
    $("#inputFindSuperCategory").attr("oninput",`getSuperCategory(${index})`)
}


function getCategory(index)
{
    $(`.spinner-border`).show()
    $.ajax({
        type: 'GET',
        url: `../api/category/client?`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
            limit:10,
            key:$("#inputFindCategory").val(),
            offset:offsetCategory
        },
        cache: false,
        success: function (data) {
            $(`.spinner-border`).hide()
            $("#div_category").empty()
            arrCartegory= []
            drawTableCategory(data, index)
        },
        error: function (data) {
            errAjax(data) 
        }
    })
}

function drawTableCategory(data, index)
{
    for(let i = 0;i<data.length;i++)
    {
        arrCartegory.push(data[i])
        $("#div_category").append(`
            <li><a onclick="selectCategory(${index},${arrCartegory.length-1})" href="javascript:void(0)">${data[i].category_name}</a></li>
        `)
    }
}


function selectCategory(indexMenu,indexCategory)
{
    for(let i =0;i<arrData[indexMenu].menu_content.length;i++)
    {
        if(arrData[indexMenu].menu_content[i].id_category == arrCartegory[indexCategory]._id)
        {
            info("Danh mục này đã tồn tại")
            return
        }
    }
    arrData[indexMenu].menu_content.push({
        id_category:arrCartegory[indexCategory]._id,
        category_name:arrCartegory[indexCategory].category_name,
        category_image:arrCartegory[indexCategory].category_image
    })
    drawMenuBuild(arrData[indexMenu].menu_content, indexMenu)
    $("#div_category").empty()
    $("#inputFindCategory").val(null)
}

function confirmSaveMenuCategory(index)
{
    hidePopup('menuBuildCaseApp')
    isLoading()
    $.ajax({
        type: 'put',
        url: `../api/menu`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: {
           id_menu:arrData[index]._id,
           arrContent: arrData[index].menu_content,
           menu_type:arrData[index].menu_type
        },
        cache: false,
        success: function (data) {
            isLoading(false)
            success("Thành công")
            getData()
        },
        error: function (data) {
            errAjax(data) 
        }
    })
}

function deleteContent(i, indexMenu)
{
    arrData[indexMenu].menu_content.splice(i,1)
    drawMenuBuild(arrData[indexMenu].menu_content,indexMenu)
}
