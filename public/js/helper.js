const ACCESS_TOKEN = getCookie("token")
const MAX_SIZE_IMAGE = 400000;
const URL_MAIN = 'https://gmkho.appnganh.xyz/'
const URL_IMAGE_BRANCH = URL_MAIN+'images/images_branch/'
const URL_IMAGE_EMPLOYEE = URL_MAIN+'images/images_employee/'
const URL_IMAGE_CATEGORY = URL_MAIN+'images/images_category/'

const IMAGE_NULL = 'https://i.pinimg.com/originals/aa/be/6d/aabe6d6db5e5f569e69e56e851eba8f0.gif'
var stt = 1;
function logout()
{
    setCookie("token",null);
    window.location = "/login"
}

function getTime()
{
    const date = new Date()
    return {
        startMonth:date.getFullYear() +"-" +addZero(date.getMonth()+1)+"-01",
        current:date.getFullYear() +"-" +addZero(date.getMonth()+1)+"-"+addZero(date.getDate()),
    }
}

function setCookie(name, value, days=30) {

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function escapehtml(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
}

function getCookie(name) {
    var match = document.cookie.match(RegExp("(?:^|;\\s*)" + escapehtml(name) + "=([^;]*)"));
    return match ? match[1] : null;
}



function isLoading(status=true)
{
    
    if(status) $("#loading_screen").show();

    else 
    {
        $("#loading_screen").hide();
    }
}





$(function() {
    $('select, .select2').each(function() {
        $(this).select2({
            theme: 'bootstrap4',
            width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
            placeholder: $(this).data('placeholder'),
            allowClear: Boolean($(this).data('allow-clear')),
            closeOnSelect: !$(this).attr('multiple'),
        });
    });
});


const tryParseInt = function (str) {
    try 
    {
        if (!isDefine(str)) return 0;
        str = str.toString().split('');
        for(let i = 0 ;i<str.length;i++)
        {
            str[i] = str[i].replace(',','').replace(/[a-z]/g, '');
        }
        var data = "";
        for(let i = 0 ;i<str.length;i++)
        {
            data += str[i].trim();
        }
        data = data.trim()
        return isNaN(parseInt(data))?0:parseInt(data) 
    } catch (e) {
        console.log(e)
        return 0;
    }
};

const tryParseFloat = function (str) {
    try 
    {
        return isNaN(parseFloat(str))?0:parseFloat(str) 
    } catch (e) {
        console.log(e)
        return 0;
    }
};
const isDefine = function (val) {
    try {
        if (val == undefined) return false;
        if (val == null) return false;
        if(typeof(val) == 'undefined') return false;
        return true;
    } catch (err) {
        return false;
    }
};

function stringToSlug(str) {
    // remove accents
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
}
function money(nStr) {
    if(typeof(nStr) == 'undefined' || nStr==null) return 0; 
    nStr.toString()
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function pagination(count, legth , isShow=4)
{
    count = Math.ceil(tryParseInt(count) / tryParseInt(limit));
    $("#divPagination").empty()
    if(legth == 0)
    {
        $("#divPagination").html('Không có dữ liệu');
        return;
    }
    let html = '<ul class="pagination">'
    let isable = "disabled"
    for(let i =1;i<=count;i++)
    {
        isable = "disabled"
        if(i==1) //hiện nút trước có 2 trường hợp xảy ra. page = 1 , page != 1 ; nếu =1 -> disabled Previous còn lại abled
        {
            if(page != 1) isable = "" 
            html += `
                <li class="page-item ${isable}">
                    <a class="page-link" onclick="changePage(${(tryParseInt(page)-1)},${legth})" href="javascript:void(0)" tabindex="-1">Trước</a>
                </li>`
        }

        if(i <= 3) // luôn hiển thị 3 trang đầu
        {
            if(i == page){ //active
                html += ` 
                <li class="page-item active">
                    <a class="page-link"  href="javascript:void(0)">${i} <span class="sr-only">(current)</span></a> 
                </li>`
            }
            else
            {
                html += `<li class="page-item"><a class="page-link" onclick="changePage(${i},${legth})" href="javascript:void(0)">${i}</a></li>`
            }
        }
        else // trường hợp nhiều hơn 3 và i lúc này lớn hơn 3 
        {
            if( (page - i >=0 && page-i <=isShow ) || ((i-page >=0 && i-page <= isShow)))
            {
                if(i == page){ //active
                    html += ` 
                    <li class="page-item active">
                        <a class="page-link" onclick="changePage(${i},${legth})"  href="javascript:void(0)">${i} <span class="sr-only">(current)</span></a> 
                    </li>`
                }
                else
                {
                    html += `<li class="page-item"><a class="page-link" onclick="changePage(${i},${legth})" href="javascript:void(0)">${i}</a></li>`
                }
            }
            else if(i!= count)// kiểm tra đẻ chỉ hiện thị dấu ...
            {
                if(page -i == isShow+1 || i-page == isShow+1) //page -i == isShow+1 hiện thị dấu ... trước , còn lại là dấu ... đằng sau
                {
                    html +=`<li class="page-item"><a onclick="changePage(${i},${legth})" class="page-link" href="javascript:void(0)">...</a></li>`
                }
            }
            else // hiện thị nút cuối cùng
            {
                html += `<li class="page-item"><a class="page-link" onclick="changePage(${i},${legth})" href="javascript:void(0)">${i}</a></li>`
            }
        }
        if(i==count && i>=2) //Hiện nút sau có 2 trang trở lên mới hiện nút next, có 2 trường hợp xảy ra. page = count , page < count ; nếu = count -> disabled Previous còn lại abled
        {
            if(page < count) isable = "" 
            html += `
                <li class="page-item ${isable}">
                    <a class="page-link" onclick="changePage(${(tryParseInt(page)+1)}, ${legth})" href="javascript:void(0)" tabindex="1">Sau</a>
                </li>`
            break;
        }
        
    }
    html += '</ul>'
    $("#divPagination").html(html)
}

function changePage(index,length)
{
    stt = ((index-1)*length)+1
    // if(index == -1)
    // {
    //     page -= 1; // ấn vào nút trước -1 page
    // }
    // else if(index == 0)
    // {
    //     page += 1
    // }
    // else
    // {
        page = index;
        // stt = ((index+1)*length)+1
    // }
    
    getData();
}

function addZero(number, length=2) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function showPopup(popup ,isEmpty=false, popupHide)
{
    if(isEmpty)
    {
        $(`#${popup} input[type=text]`).val(null)
        $(`#${popup} input[type=text]`).attr("autocomplete","off")
        $(`#${popup} input[type=file]`).val(null)
        $(`#${popup} .number`).val(0)
        $(`#${popup} img`).attr("src",IMAGE_NULL)
    }
    $(`#${popup}`).modal('show');
    if(typeof popupHide != 'undefined')
    {
        hidePopup(popupHide)
    }
   
}

function hidePopup(popup,popupShow)
{
    $(`#${popup}`).modal('hide')
    if(typeof popupShow != 'undefined')
    {
        showPopup(popupHide)
    }
}

function success(text_tb) {
    Swal.fire(
        'Thông Báo',
        text_tb,
        'success'
    );
};

function warning(text_tb) {
    Swal.fire(
        'Thông Báo',
        text_tb,
        'warning'
    );
};

function error(text_tb) {
    Swal.fire(
        'Thông Báo',
        text_tb,
        'error'
    );
};

function info(text_tb) {
    Swal.fire(
        'Thông Báo',
        text_tb,
        'info'
    );
};

function inputNumber(input ,typeNumber='int')
{
    if($(input).val().length == 0) $(input).val(0);
    if(typeNumber == 'int')
        $(input).val(tryParseInt($(input).val()));
    if(typeNumber == 'float')
    {
        console.log($(input).val())
        $(input).val(parseFloat($(input).val()));

    }
}


function isChecked(time)
{
    if(time.hours ==0 && time.minutes == 0 && time.seconds ==0) return  false;
    return true;
}

function achievement(in_morning, out_morning, in_afternoon, out_afternoon)
{
    let number = 0;
    if(isChecked(in_morning) && isChecked(out_morning))
    {
        const totalMinutes = (out_morning.hours*60+out_morning.minutes - in_morning.hours*60+in_morning.minutes)/60;
      
        if(totalMinutes/8 > 0.5)
            number = 0.5
        else number = totalMinutes/8
    }
    if(isChecked(in_afternoon) && isChecked(out_afternoon))
    {
        const totalMinutes = (in_afternoon.hours*60+in_afternoon.minutes - out_afternoon.hours*60+out_afternoon.minutes)/60;
      
        if(totalMinutes/8 > 0.5)
            number += 0.5
        else number += totalMinutes/8
    }
    return round2(number);
}

function dataTable(id,isButton=true)
{
    if(typeof(id) == 'undefined' || id==null)
    {
        id='dataTable'
    }
    var buttons = ['copy', 'csv', 'excel', 'pdf', 'print']
    if(!isButton)
    {
        buttons = []
    }
    $(`#${id}`).DataTable( {
        dom: 'Bfrtip',
        lengthChange: true,
        paging:true,
        lengthMenu:[[10,30,40,50,-1],[10,30,40,50,'Tất cả']],
        buttons: buttons
    } );
}


function decimalAdjust(type, value, exp) {
    try {
        if (!isDefine(value)) return false;
        // If the exp is undefined or zero...
        if (typeof exp === "undefined" || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split("e");
        value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
        // Shift back
        value = value.toString().split("e");
        return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    } catch (err) {
        throwError(err);
        return false;
    }
}


const round2 = (value) => decimalAdjust("round", value, -2);
const round = (value) => decimalAdjust("round", value, 0);
// Decimal floor
const floor2 = (value) => decimalAdjust("floor", value, -2);
// Decimal ceil
const ceil2 = (value) => decimalAdjust("ceil", value, -2);
const ceil = (value) => decimalAdjust("ceil", value, 0);


function dayOfWeek(val) {
    var currentDate = new Date(val);
    if(currentDate.getDay() == 0)
    {
        currentDate.setDate(currentDate.getDate()-1)
    }
    const monday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+1)).toUTCString();
    const tuesday = nextDay(monday)
    const wednesday = nextDay(tuesday)
    const thursday = nextDay(wednesday)
    const friday = nextDay(thursday)
    const saturday = nextDay(friday)
    const sunday = nextDay(saturday)

    return {
        monday : monday ,
        tuesday : tuesday ,
        wednesday : wednesday ,
        thursday : thursday ,
        friday : friday ,
        saturday : saturday ,
        sunday : sunday ,
    }

}
function nextweek(){
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    return nextweek;
}
function nextDay(val)
{
    var currentDate = new Date(val);
    return new Date(currentDate.setDate(currentDate.getDate()+1)).toUTCString();

}

function sameDay(val1, val2)
{
  
    val1 = new Date(val1)
    val2 = new Date(val2)    
  
    if( (val1.getDate() == val2.getDate()) && (val1.getMonth() == val2.getMonth()) && (val1.getFullYear() == val2.getFullYear()))
    {
        return true
    }
    return false
}

$(window).on('popstate', function(event) {
    window.location = window.location.search
    window.history.pushState({id:1}, null,'');
});

function changeURL(urlPath){
    window.history.pushState({id:1}, null, urlPath);
}


$('#keyFind').on('keypress',(event)=>{
    if(event.which == '13')
    {
        getData(false)
    }
})

function downloadExcelLocal( data,fileName="download")
{
    
    var opts = [{sheetid:'One',header:true},{sheetid:'Two',header:false}];
    alasql(`SELECT INTO XLSX("${fileName}.xlsx",?) FROM ?`,
                        [opts,[data]]);
}