var fs = require('fs');
window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const ipc = electron.ipcRenderer;

(function ($) {
    $.fn.serializeFormJSON = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);


var x = JSON.parse(fs.readFileSync(`${process.env.APPDATA}/nims_aap/config.json`, {
    encoding: 'utf8'
}));
console.log(x);

$('#login_form').on('submit', async function (e) {
    e.preventDefault();
    var _data = $('#login_form').serializeFormJSON();
    console.log(_data)
    if (_data.user_name == x.username && _data.password == x.password) {
        ipc.send('loggedIn', 'loggedin')
    } else {
        Swal.fire({
            type: 'error',
            title: 'NIMS: Login failed',
            text: `Username/Password doesn't matched, please try again`
        })
    }


})
$('#key_check_form').on('submit', function (e) {
    e.preventDefault();
    var formData = $('#key_check_form').serializeFormJSON();
    if (formData.reg_key == x.client) {
        $('#restTab').css('display', 'block')
        $('#key_check_div').css('display', 'none')
        $(this).trigger('reset');
    } else {
        Swal.fire({
            type: 'error',
            title: 'Password Reset',
            text: 'Registration key not matched'
        })
        $('#restTab').css('display', 'none')
        $('#key_check_div').css('display', 'block')
    }
})
$('#login_form_reset').on('submit', function (e) {
    e.preventDefault();
    var formData = $('#login_form_reset').serializeFormJSON();
    if (formData.password == formData.password1) {
        $('#pass_not_matched').css('display', 'none')
        x.password = formData.password;
        x.passwordL = formData.password;
        y = JSON.stringify(x);
        fs.writeFileSync(`${process.env.APPDATA}/nims_aap/config.json`, y, {
            encoding: 'utf8'
        })
        $('#exampleModalCenter').modal('hide');

        Swal.fire({
            type: 'success',
            title: 'Password Reset',
            text: 'Password updated'
        })
        $(this).trigger('reset');
    } else {
        $('#pass_not_matched').css('display', 'block')
    }
})

$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
    $('#restTab').css('display', 'none')
    $('#key_check_div').css('display', 'block')
})