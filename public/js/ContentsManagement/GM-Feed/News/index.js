
getData()
function getData(){
    limit = tryParseInt($("#selectLimit option:selected").val())
    key = $("#keyFind").val()
    const fromdate = $("#fromdate").val()
    const todate = $("#todate").val()
    callAPI('GET',API_NEWS,{
        limit:limit,
        key:key,
        page:page,
        fromdate:fromdate,
        todate:todate
    }, data =>{
        drawTable(data.data);
        pagination(data.count, data.data.length)
        changeURL(`?limit=${limit}&page=${page}&key=${key}`)
    })
}

function drawTable(data){

    $("#tbodyTable").empty()

    for(let i =0;i<data.length;i++){
        $("#tbodyTable").append(`
            <tr>
                <td>${stt+i}</td>
                <td>${data[i].news_title}</td>
                <td> <img src=${URL_IMAGE_NEWS}/${data[i].news_image}></td>
                <td><i onclick="newPage('/news-management/edit-news?id_news=${data[i]._id}')" class="fas fa-edit text-primary"></i></td>
            </tr>
        `)
    }
}

function paste_Image(input, image) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(`#${image}`).attr("src", e.target.result)
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}
