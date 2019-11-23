let fs = require('fs')
const knex = require('../mainfunc/db');
const gd = require('../mainfunc/dropDowns')
module.exports.initGridOutreach_ind_upd = function () {
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

    $('#resetOutReachFormUpd').on('click', () => {
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


      }else if(entType == 'plw_screening'){
          $('#p_type>option').each(function(){
              if($(this).val() == 'children'){
                  $(this).attr('disabled', true)
              }else{
                  $(this).attr('disabled', false)
              }
          })
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

    $('#scrChildrenFormUpd').on('submit', (e) => {
        e.preventDefault();
        var data = $('#scrChildrenFormUpd').serializeFormJSON();
        data.staff_name = $('#ddStaff_name option:selected').text()
        data.sup_name = $('#ddSup_name option:selected').text()
        knex('tblOutreachInd').update(data).where({outreach_id: data.outreach_id})
        .then(r=>{
          console.log(r)
          $('#scrChildrenFormUpd').get(0).reset();
          $('#jsGridOutReachInd').jsGrid("render").done(() => {
            // console.log('js grid rendered')
          })
          Swal.fire({
              type: 'success',
              title: 'Record updated'
          })
      }).catch(e=>{
          console.log(e)
          Swal.fire({
              type: 'error',
              title: 'DB Error',
              text: 'Please contact administrator'
          })
      })
    })

    $(()=>{
      let getOutInd = filter => {
        return new Promise(async (resolve, reject) => {
          var _limit = (filter.pageSize) ? filter.pageSize : 10;
          var _offset = (filter.pageIndex == 1) ? 0 : (filter.pageIndex - 1) * _limit;

          console.log(filter)
          try {
            var _thisData = await   knex('v_outreach_ind').where({is_deleted:0})
            .where((builder)=>{
              // var myFilter;
              if(filter.uc_name != ''){
                builder.where('uc_name', 'like', `%${filter.uc_name}%`)
              }else if(filter.ent_date != ''){
                builder.where('ent_date', 'like', `%${filter.ent_date}%`)
              }else if(filter.entry_type != ''){
                builder.where('entry_type', 'like', `%${filter.entry_type}%`)
              }else if(filter.h_or_f_name != ''){
                builder.where('h_or_f_name', 'like', `%${filter.h_or_f_name}%`)
              }else if(filter.p_name != ''){
                builder.where('p_name', 'like', `%${filter.p_name}%`)
              }else if(filter.sup_name != ''){
                builder.where('sup_name', 'like', `%${filter.sup_name}%`)
              }else if(filter.staff_name != ''){
                builder.where('staff_name', 'like', `%${filter.staff_name}%`)
              }else if(filter.session_type != ''){
                builder.where('session_type', 'like', `%${filter.session_type}%`)
              }
              console.log(builder)

              return builder;
            })
            // .where('uc_name', 'like', `%${filter.uc_name}%`)
            // .where('ent_date', 'like', `%${filter.ent_date}%`)
            // .where('entry_type ', 'like', `%${filter.entry_type }%`)
            // .where('h_or_f_name ', 'like', `%${filter.h_or_f_name }%`)
            // .where('p_name ', 'like', `%${filter.p_name }%`)
            // .where('sup_name', 'like', `%${filter.sup_name}%`)
            // .where('staff_name', 'like', `%${filter.staff_name}%`)
            // .where('type', 'like', `%${filter.type}%`)
            // .where('session_type', 'like', `%${filter.session_type}%`)
            .limit(_limit)
            .offset(_offset)
            var _thisCount = await   knex('v_outreach_ind').where({is_deleted:0})
            .where((builder)=>{
              // var myFilter;
              if(filter.uc_name != ''){
                builder.where('uc_name', 'like', `%${filter.uc_name}%`)
              }else if(filter.ent_date != ''){
                builder.where('ent_date', 'like', `%${filter.ent_date}%`)
              }else if(filter.entry_type != ''){
                builder.where('entry_type', 'like', `%${filter.entry_type}%`)
              }else if(filter.h_or_f_name != ''){
                builder.where('h_or_f_name', 'like', `%${filter.h_or_f_name}%`)
              }else if(filter.p_name != ''){
                builder.where('p_name', 'like', `%${filter.p_name}%`)
              }else if(filter.sup_name != ''){
                builder.where('sup_name', 'like', `%${filter.sup_name}%`)
              }else if(filter.staff_name != ''){
                builder.where('staff_name', 'like', `%${filter.staff_name}%`)
              }else if(filter.session_type != ''){
                builder.where('session_type', 'like', `%${filter.session_type}%`)
              }
              console.log(builder)
              return builder;
            })
            .count({count:'outreach_id'})
            var s = {
              data: _thisData,
              itemsCount: _thisCount[0].count
            };
            console.log(s)
            resolve(s)

          } catch (error) {
            reject(error)
          }
        });
      };
      let delOutInd = item => {
        return new Promise((resolve, reject) => {
          knex('v_outreach_ind')
          .update({is_deleted:0})
          .where({outreach_id:item.outreach_id})
          .then(r=>{
            resolve()
          }).catch(e=>{
            console.log(e)
  
            reject(e)
          })
        });
      }
      
      $("#jsGridOutReachInd").jsGrid({
          width: "100%",
          height: "300px",
          filtering: true,
          // editing: true,
          sorting: true,
          paging: true,
          autoload: true,
          pageLoading: true,
          // data: allData,
          controller: {
            loadData:  filter => {
              console.log(filter)
              // console.log(getOutInd(filter))
              // var ____d = 
              // console.log(____d)
              // console.log(getOutInd(filter))
              return getOutInd(filter)
            },
            deleteItem: function (item) {
              // console.log(item)
  
               delOutInd(item);
            }
          },
          fields: [{
              name: "ent_date",
              title: "Entry Date",
              type: "text",
              editing: false,
              width: 50
              // editing:false
            },
            {
              name: "uc_name",
              title: "Uion Council",
              type: "text",
              width: 50
            },
            {
              name: "staff_name",
              title: "Staff",
              type: "text",
              editing: false,
              width: 100
            },
            {
              name: "sup_name",
              title: "Supervisor",
              type: "text",
              editing: false,
              width: 100
            },
            {
              name: "entry_type",
              title: "Entry Type",
              valueType: "text",
              type:'select',
              filtering: true,
              width: 50,
              items:[
                  {
                      Name:'Select One',
                  value:''
                  },
                  {
                  Name:'Child Screening',
                  value:'child_screening'
                  },
                  {
                  Name:'Plw Screening',
                  value:'plw_screening'
                  },
                  {
                  Name:'Session Entry',
                  value:'session_entry'
                  },
              ], valueField: "value",
              textField: "Name",   
            },
            {
              name: "type",
              title: "Record Type",
              valueType: "text",
              type:'select',
              filtering: true,
              width: 50,
              items:[
                  {
                      Name:'Select One',
                  value:''
                  },
                  {
                  Name:'New Screening',
                  value:'newScr'
                  },
                  {
                  Name:'Re-Screening',
                  value:'reScr'
                  }
              ], valueField: "value",
              textField: "Name",   
            },
            {
              name: "session_type",
              title: "Session Type",
              valueType: "text",
              type:'select',
              filtering: true,
              width: 50,
              items:[
                  {
                  Name:'Select One',
                  value:''
                  },
                  {
                  Name:'>Nutrition, Health and Hygene',
                  value:'nut_health_hygene'
                  },
                  {
                  Name:'IYCF',
                  value:'iycf'
                  },
                  {
                  Name:'ANC, PNC & TT2 counselling',
                  value:'anc_pnc_tt2'
                  },
                  {
                  Name:'Cooking Demonstration',
                  value:'cooking'
                  },
                  {
                  Name:'Other',
                  value:'other'
                  }
              ], valueField: "value",
              textField: "Name",   
            },
            {
              name: "p_name",
              title: "Name",
              type: "text",
              filtering: true,
              width: 50
            },
            {
              name: "h_or_f_name",
              title: "Father/ Husband Name",
              type: "text",
              filtering: true,
              width: 50
            },
            
            {
              name: "cnic",
              title: "CNIC",
              type: "text",
              filtering: true,
              width: 50
            },
            {
              name: 'upload_status',
              title: 'Upload Status',
              width: 50,
              type: 'select',
              valueType: 'number',
              items: [{
                Name: '',
                value: ''
              }, {
                Name: 'Uploaded',
                value: 1
              }, {
                Name: 'Not Uploaded',
                value: 0
              }, {
                Name: 'Edited',
                value: 2
              }],
              readOnly: true,
              valueField: "value",
              textField: "Name",
              editing: false,
              inserting: false,
              filtering: false,
    
            },
            {
              name: "upload_date",
              title: "Upload Date",
              type: "number",
              filtering: false,
              width: 50
            },
            {
              width: 80,
              align: 'center',
              headerTemplate: function () {
                return "<th class='jsgrid-header-cell'>Days since uploaded </th>";
              },
              itemTemplate: function (value, item) {
                // console.log(item)
                var date1 = new Date(item.upload_date);
                var date2 = new Date();
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                diffDays = (item.upload_status == 1) ? diffDays : 0;
                // alert(diffDays);
                return diffDays;
              }
            },
            {
              type: "control",
              editButton: false,
              modeSwitchButton: false,
              width: 50
            }
          ],
          //   onItemEditing: function(args) {
          //     var date1 = new Date(args.item.upload_date);
          //           var date2 = new Date();
          //           var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          //           var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
          //     // cancel editing of the row of item with field 'ID' = 0
          //     if(diffDays > 0) {
          //         args.cancel = true;
          //     }
          // },
          rowClick: async function (args) {
            var date1 = new Date(args.item.upload_date);
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            diffDays = (args.item.upload_status == 1) ? diffDays : 0;
            if (diffDays < 99) {
    
              this.editItem(args.item);
              var data = args.item;
              var dataKeys = Object.keys(data);
              // console.log(dataKeys);
              var ___xx = await gd.getAllOtpDistrict(data.district_id);
              ___xx.forEach(el => {
                  if(el.site_name){
                              $('#ref_otp').append(`<option value="${el.site_id}">${el.tehsil_name}/${el.uc_name}/${el.site_name}</option>`)
                  }
              });
              dataKeys.forEach(el => {
                $(`input[name="${el}"]`).val(data[el]);
                $(`select[name="${el}"]`).val(data[el]);
                // console.log(data[el])
                // }
              });
              if(data.referred_to == 'otp'){
                $('#otp_div').css('display', 'block')
                $('#nsc_div').css('display', 'none')
                $('#ref_otp').attr('required', true)
                $('#ref_nsc').attr('required', false)
            }else if(data.referred_to == 'nsc') {
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

            if(data.session_type == 'other'){
              $('#other_session_div').css('display', 'block')
              $('#other_session').attr('required', true)
    
          }else{
              $('#other_session_div').css('display', 'none')
              $('#other_session').attr('required', false)
          }

          if(data.session_given == 'no'){
            $('#grp_ind').attr('disabled', true)
            $('#session_type').attr('disabled', true)
        }else {
            $('#grp_ind').attr('disabled', false)
            $('#session_type').attr('disabled', false)
  
            
        }
        if(data.p_type == 'lactating' || data.p_type == 'children'){
          $('#p_month').attr('disabled', true)
      }else {
          $('#p_month').attr('disabled', false)

          
      }
      var entType = data.entry_type
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


    }else if(entType == 'plw_screening'){
        $('#p_type>option').each(function(){
            if($(this).val() == 'children'){
                $(this).attr('disabled', true)
            }else{
                $(this).attr('disabled', false)
            }
        })
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
              $("#ddProvince").val(data.province_id);
    
              $("#ddDistrict")
                .children("option:not(:first)")
                .remove();
              $("#ddDistrict").append(
                `<option value="${data.district_id}" selected>${
                data.district_name
                }</option>`
              );
              $('#ent_type').val(data.ent_type)
              $('#site_two').children('option:not(:first)').remove();
              ipc.send('getAddSitesByDistrict', data.district_id);
              ipc.on('getAddSitesByDistrict', (e, r) => {
    
                for (site of r.r) {
                  $('#site_two').append(`<option value="${site.site_name}">${site.site_name}</option>`);
                }
              })
              // $("#ddDistrict").val(data.district_id);
              $("#ddTehsil")
                .children("option:not(:first)")
                .remove();
              $("#ddTehsil").append(
                `<option value="${data.tehsil_id}" selected>${
                data.tehsil_name
                }</option>`
              );
    
              // $("#ddTehsil").val(data.tehsil_id);
              $("#ddUC")
                .children("option:not(:first)")
                .remove();
              $("#ddUC").append(
                `<option value="${data.uc_id}" selected>${data.uc_name}</option>`
              );
    
              $("#ddUC").val(data.uc_id);
              $("#ddStaff_code")
                .children("option:not(:first)")
                .remove();
              $("#ddStaff_code").append(
                `<option value="${data.staff_code}" selected>${
                data.staff_code
                }</option>`
              );
              $("#ddStaff_name")
                .children("option:not(:first)")
                .remove();
              $("#ddStaff_name").append(
                `<option value="${data.staff_name}" selected>${
                data.staff_name
                }</option>`
              );
              $("#ddSup_code")
                .children("option:not(:first)")
                .remove();
              $("#ddSup_code").append(
                `<option value="${data.sup_code}" selected>${
                data.sup_code
                }</option>`
              );
              $("#ddSup_name")
                .children("option:not(:first)")
                .remove();
              $("#ddSup_name").append(
                `<option value="${data.sup_name}" selected>${
                data.sup_name
                }</option>`
              );
              
    
    
              // $('#p_name').val(data.p_name);
              // $('#gender').val(data.gender);
              // $('#village').val(data.site_village);
              // $('#otp_id').val(data.otp_id);
              // console.log(args.item);
            } else {
              alert('This could not be edited b/c its been more than 5 days since uploaded')
            }
          }
        });
    })


  


}