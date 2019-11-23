let fs = require('fs')
const knex = require('../mainfunc/db');
const gd = require('../mainfunc/dropDowns')
module.exports.initGridOutreach_ind_report = function () {
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
            // var ___xx = await gd.getAllOtpDistrict(dist);
            // ___xx.forEach(el => {
            //     if(el.site_name){
            //                 $('#ref_otp').append(`<option value="${el.site_id}">${el.tehsil_name}/${el.uc_name}/${el.site_name}</option>`)
            //     }
            // });
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
    

    
    $(()=>{
        $("#OutReachInd_report")
    .on('processing.dt', function (e, settings, processing) {
      $('.spinner-border').css('display', processing ? 'block' : 'none');
    }).DataTable({
      data: [],
      dom: "Bfrtip",
      buttons: ["copy", {
        extend: "csv",
        title: 'Outreach Report_' + new Date().toDateString()
      }, {
        extend: "excel",
        title: 'Outreach Report_' + new Date().toDateString()
      }],
      retrieve: true,
      paging: true,
      columns: [
        {
          title:'Entry Date',
          data:'ent_date'
        },
        {
          title:'Province',
          data:'province'
        }
        ,{
          title:'District',
          data:'district_name'
        }
        ,{
          title:'Tehsil',
          data:'tehsil_name'
        }
        ,{
          title:'UC',
          data:'uc_name'
        }
        ,{
          title:'Supervisor Name',
          data:'sup_name'
        }
        ,{
          title:'Supervisor code',
          data:'sup_code'
        }
        ,{
          title:'Staff Name',
          data:'staff_name'
        }
        ,{
          title:'Staff code',
          data:'staff_code'
        }
        ,{
          title:'Entry Type',
          data:'entry_type'
        }
        ,{
          title:'Record Type',
          data:'type'
        }
        ,{
          title:'Father/ Husband Name',
          data:'h_or_f_name'
        }
        ,{
          title:'Age',
          data:'age'
        }
        ,{
          title:'Gender',
          data:'gender'
        }
        ,{
          title:'CNIC',
          data:'cnic'
        }
        ,{
          title:'Contact No',
          data:'contact'
        }
        ,{
          title:'Address',
          data:'address'
        }
        ,{
          title:'Participant Type',
          data:'p_type'
        }
        ,{
          title:'Preganancy Month',
          data:'p_month'
        }
        ,{
          title:'MUAC',
          data:'muac'
        }
        ,{
          title:'Session Given',
          data:'session_given'
        }
        ,{
          title:'Group/ Individual',
          data:'grp_ind'
        }
        ,{
          title:'Session Type',
          data:'session_type'
        }
        ,{
          title:'Other Session',
          data:'other_session'
        }
        ,{
          title:'Commodity 1',
          data:'comm1'
        }
        ,{
          title:'Quantity 1',
          data:'qty1'
        }
        ,{
          title:'Commodity 2',
          data:'comm2'
        }
        ,{
          title:'Quantity ',
          data:'qty2'
        }
        ,{
          title:'Referred To',
          data:'referred_to'
        }
        ,{
          title:'OTP Name',
          data:'site_name'
        }
        ,{
          title:'NSC Name',
          data:'nsc_name'
        }        
      ]
    });
    })


    $('.filter').on('change', async(e) => {
        e.preventDefault();
        try {
         var rpt_outreach = await knex('v_outreach_ind_report').where({is_deleted:0})
         .where((builder)=>{

         })
        } catch (error) {
            
        }
    })

    $('#show_outrach_ind_report_btn').on('click', async function(e){
        e.preventDefault()
        var filter = {};
        filter.entry_type = $('#entry_type').val() ? $('#entry_type').val() : '';
        filter.province_id = $('#ddProvince').val() ? $('#ddProvince').val() : '';
        filter.district_id = $('#ddDistrict').val() ? $('#ddDistrict').val() : '';
        filter.tehsil_id  = $('#ddTehsil').val() ? $('#ddTehsil').val() : '';
        filter.uc_id = $('#ddUC').val() ? $('#ddUC').val() : '';
        filter.sup_code = $('#ddSup_code').val() ? $('#ddSup_code').val() : '';
        filter.sup_name = $('#ddSup_name option:selected').text() ? $('#ddSup_name option:selected').text()  : '';
        filter.staff_code = $('#ddStaff_code').val() ? $('#ddStaff_code').val() : '';
        filter.staff_name = $('#ddStaff_name option:selected').text() ? $('#ddStaff_name option:selected').text()  : '';
        filter.type = $('#type').val() ? $('#type').val() : '';
        filter.start_date = $('#start_date').val() ? $('#start_date').val() : '';
        filter.end_date = $('#end_date').val() ? $('#end_date').val() : '';
        try {
            var _thisData = await   knex('v_outreach_ind_report').where({is_deleted:0})
            .where((builder)=>{
              if(filter.sup_code != ''){
                builder.where('sup_code', 'like', `%${filter.sup_code}%`)
              }else if(filter.entry_type != ''){
                builder.where('entry_type', 'like', `%${filter.entry_type}%`)
              }else if(filter.province_id != ''){
                builder.where('province_id', 'like', `%${filter.province_id}%`)
              }else if(filter.district_id != ''){
                builder.where('district_id', 'like', `%${filter.district_id}%`)
              }else if(filter.tehsil_id != ''){
                builder.where('tehsil_id', 'like', `%${filter.tehsil_id}%`)
              }else if(filter.uc_id != ''){
                builder.where('uc_id', 'like', `%${filter.uc_id}%`)
              }else if(filter.sup_name != ''){
                builder.where('sup_name', 'like', `%${filter.sup_name}%`)
              }else if(filter.staff_name != ''){
                builder.where('staff_name', 'like', `%${filter.staff_name}%`)
              }else if(filter.staff_code != ''){
                builder.where('staff_code', 'like', `%${filter.staff_code}%`)
              }else if(filter.type != ''){
                builder.where('type', 'like', `%${filter.type}%`)
              }else if (filter.start_date != '' && filter.end_date != ''){
                  builder.whereBetween('ent_date', [filter.start_date, filter.end_date])
              }
              console.log(builder)
              return builder;
            })
            
            $('#OutReachInd_report').dataTable().fnClearTable();
            $('#OutReachInd_report').dataTable().fnAddData(_thisData);
        } catch (error) {
            console.log(error)
        }
        
    })


}