let fs = require('fs')
const knex = require('../mainfunc/db');
const gd = require('../mainfunc/dropDowns')
const uuid = require('uuid/v4');
module.exports.initGridOutreach_ind = function () {
    $(":input").inputmask();

    const {
        client,
        mac
    } = JSON.parse(
        fs.readFileSync(`${process.env.APPDATA}/nims_aap/config.json`, "utf8")
    );

    $(function () {
        ipc.send('getProvince');
        ipc.on('province', function (evt, province) {
            $('#ddProvince').children('option:not(:first)').remove();
            prov(province);
        })
        $('#ddProvince').on('change', function () {
            var prov = $(this).val();
            ipc.send('getDistrict', prov)
            ipc.on('district', function (evt, district) {
                $('#ddDistrict').children('option:not(:first)').remove();
                dist(district);
            })
        })
        $('#ddDistrict').on('change', async function () {
            var dist = $(this).val();
            ipc.send('getTehsil', dist)
            ipc.on('tehsil', function (evt, tehsil) {
                $('#ddTehsil').children('option:not(:first)').remove();
                teh(tehsil);
                $('#ref_otp').children('option:not(:first)').remove();
                
                

            })
            var ___xx = await gd.getAllOtpDistrict(dist);
            ___xx.forEach(el => {
                if(el.site_name){
                            $('#ref_otp').append(`<option value="${el.site_id}">${el.tehsil_name}/${el.uc_name}/${el.site_name}</option>`)
                }
            });
                // gd.getAllOtpDistrict(dist).then(result=>{
                //     if(result.length){
                //         $('#ref_otp').append(`<option value="${el.site_id}">${el.tehsil_name}/${el.uc_name}/${el.site_name}</option>`)
                //     }
                // })
        })
        $('#ddTehsil').on('change', async function () {
            var tehs = $(this).val();
            ipc.send('getUC', tehs)
            ipc.on('uc', function (evt, uc) {
                $('#ddUC').children('option:not(:first)').remove();

                ucListener(uc);
            })
            // gd.getAllNSC().then(result=>{
                $('#ref_nsc').children('option:not(:first)').remove();
            //     if(result.length){
            //         result.forEach(el => {
            //             $('#ref_nsc').append(`<option value="${el.nsc_name}">${el.nsc_name}</option>`)
            //         });
            //     }
            // }).catch(e=>{
            //     console.log(e)
            // })
            // knex()
            var allNscs = await gd.getAllNSC();
            allNscs.forEach(el=>{
                $('#ref_nsc').append(`<option value="${el.nsc_name}">${el.nsc_name}</option>`)

            })
        })
        var ucForHH;
        $('#ddUC').on('change', function () {
            var ucs = $(this).val();
            ucForHH = ucs
            ipc.send('getHealthHouse', ucs)
            ipc.on('hh', async function (evt, hh) {
                $('#site_one').children('option:not(:first)').remove();

                hhListener_siteOne(hh);

            });
            ipc.send("getStaffuc", ucs);
            ipc.send("getSupsuc", ucs);

            ipc.on("haveStaffuc", function (evt, staffs) {
                $("#ddStaff_code")
                    .children("option:not(:first)")
                    .remove();
                staffListeneruc(staffs);
            });
            ipc.on("haveSupsuc", function (evt, _sups) {
                $("#ddSup_code")
                    .children("option:not(:first)")
                    .remove();
                supListeneruc(_sups);
            });
        })

        $("#ddStaff_code").on("change", function () {
            var staff_code = $(this).val();
            $("#ddStaff_name").val(staff_code);
        });
        $("#ddStaff_name").on("change", function () {
            var staff_code = $(this).val();
            $("#ddStaff_code").val(staff_code);
        });
        $("#ddSup_code").on("change", function () {
            var sup_code = $(this).val();
            $("#ddSup_name").val(sup_code);
        });
        $("#ddSup_name").on("change", function () {
            var sup_code = $(this).val();
            $("#ddSup_code").val(sup_code);
        });

    })
    
    $('#resetOutReachForm').on('click', () => {
        $('#resetOutReachForm').get(0).reset();
    })

    $('#entry_type').on('change', function(){
        var entType = $(this).val();
        console.log(entType)
        if(entType == 'child_screening'){
            $('#p_type>option').each(function(){
                // console.log(this)
                if($(this).val() != 'children'){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#p_month').attr('disabled', true)
            $('#muac').attr('min', 5)
            $('#muac').attr('max', 15)
            $('#session_given').attr('disabled', true)
            $('#grp_ind').attr('disabled', true)
            $('#session_type').attr('disabled', true)
            $('#comm1>option').each(function(){
                if($(this).val() == "IFA Tablets"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#comm2>option').each(function(){
                if($(this).val() == "IFA Tablets"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#qty1').attr('disabled', false)
            $('#qty2').attr('disabled', false)
            $('#gender>option').each(function(){
                $(this).attr('disabled', false)
            })
            $('#type').attr('disabled', false)
            $('#age_type').text('(in Months)')


        }else if(entType == 'plw_screening'){
            $('#p_type>option').each(function(){
                if($(this).val() == 'children'){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#age_type').text('(in Yrs)')
            $('#p_month').attr('disabled', false)
            $('#muac').attr('min', 15)
            $('#muac').attr('max', 25)
            $('#session_given').attr('disabled', false)
            $('#grp_ind').attr('disabled', false)
            $('#session_type').attr('disabled', false)
            $('#comm1>option').each(function(){
                if($(this).val() == "MNP"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#comm2>option').each(function(){
                if($(this).val() == "MNP"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#gender>option').each(function(){
                if($(this).val() == "trans"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#type').attr('disabled', false)
            $('#qty1').attr('disabled', false)
            $('#qty2').attr('disabled', false)
            $('#referred_to').attr('disabled', true)
        }else if(entType=='session_entry'){
            $('#age_type').text('(in Yrs)')
            $('#muac').removeAttr('min')
            $('#muac').removeAttr('max')
            $('#muac').attr('disabled', true)
            $('#type').attr('disabled', true)
            $('#referred_to').attr('disabled', true)
            $('#comm1').attr('disabled', true)
            $('#comm2').attr('disabled', true)
            $('#qty1').attr('disabled', true)
            $('#qty2').attr('disabled', true)
            $('#p_type>option').each(function(){
                if($(this).val() == 'children'){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#session_given').attr('disabled', false)
            $('#grp_ind').attr('disabled', false)
            $('#session_type').attr('disabled', false)
            $('#comm1>option').each(function(){
                if($(this).val() == "MNP"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })
            $('#comm2>option').each(function(){
                if($(this).val() == "MNP"){
                    $(this).attr('disabled', true)
                }else{
                    $(this).attr('disabled', false)
                }
            })

            $('#gender>option').each(function(){
                $(this).attr('disabled', false)
            })

        }
    })

    $('#p_type').on('change', function(){
        var pType= $(this).val();
        if(pType == 'lactating' || pType == 'children'){
            $('#p_month').attr('disabled', true)
        }else {
            $('#p_month').attr('disabled', false)

        }
    })
    $('#session_given').on('change', function(){
        var sGiven= $(this).val();
        if(sGiven == 'no'){
            $('#grp_ind').attr('disabled', true)
            $('#session_type').attr('disabled', true)
        }else {
            $('#grp_ind').attr('disabled', false)
            $('#session_type').attr('disabled', false)

        }
    })
    $('#referred_to').on('change', function(){
        var refTo= $(this).val();
        if(refTo == 'otp'){
            $('#otp_div').css('display', 'block')
            $('#nsc_div').css('display', 'none')
            $('#ref_otp').attr('required', true)
            $('#ref_nsc').attr('required', false)
        }else if(refTo == 'nsc') {
            $('#otp_div').css('display', 'none')
            $('#nsc_div').css('display', 'block')
            $('#ref_otp').attr('required', false)
            $('#ref_nsc').attr('required', true)

        }else{
            $('#otp_div').css('display', 'none')
            $('#nsc_div').css('display', 'none')
            $('#ref_otp').attr('required', false)
            $('#ref_nsc').attr('required', false)

        }
    })
    $('#session_type').on('change', function(){
        if($(this).val() == 'other'){
            $('#other_session_div').css('display', 'block')
            $('#other_session').attr('required', true)

        }else{
            $('#other_session_div').css('display', 'none')
            $('#other_session').attr('required', false)
        }
    })
    $('#comm1').on('change', function () {
        var that = $(this)
        $('#comm2 option').each(function () {
          if ($(this).val() == that.val()) {
            $(this).prop('disabled', true)
          } else {
            $(this).prop('disabled', false)
    
          }
        })
      })

    $('#outrachIndEntry').on('submit', (e) => {
        e.preventDefault();
        var data = $('#outrachIndEntry').serializeFormJSON();
        data.staff_name = $('#ddStaff_name option:selected').text()
        data.sup_name = $('#ddSup_name option:selected').text()
        data.outreach_id = uuid();
        data.client_id = client;
        knex('tblOutreachInd').insert(data)
        .then(r=>{
            console.log(r)
            Swal.fire({
                type: 'success',
                title: 'Record Added'
            })
            $('.clr').val("");
            $('.cld').val("");
        }).catch(e=>{
            console.log(e)
            Swal.fire({
                type: 'error',
                title: 'DB Error',
                text: 'Please contact administrator'
            })
        })
    })

    $('#resetScrChildForm').on('click', () => {
        $('#outrachIndEntry').get(0).reset();
      })

   
      $(function () {
        var datePickerId = document.getElementById('txtScrChildDate');
        datePickerId.max = new Date().toISOString().split("T")[0];
      });

}