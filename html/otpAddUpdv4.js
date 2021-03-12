const knex = require('../mainfunc/db');
const { nscAdmissionLogic,
  otpAdmissionLogic,
  changeMuacOnOdema, hhOnProgType } = require('./utils/utilAdd');

module.exports.initOtpAddUpdV2 = function () {
  $(":input").inputmask();

  function updateProvinceDD() {

    ipc.send("getProvince");
    ipc.on("province", function (evt, province) {
      $("#ddProvince")
        .children("option:not(:first)")
        .remove();

      // province.province.forEach(el=>{
      // $('#ddProvince').append(`<option value="${el.id}">${el.provinceName}</option>`);

      // })
      prov(province);
    });
  }
  // (function ($) {
  //   $.fn.serializeFormJSON = function () {
  //     var o = {};
  //     var a = this.serializeArray();
  //     $.each(a, function () {
  //       if (o[this.name]) {
  //         if (!o[this.name].push) {
  //           o[this.name] = [o[this.name]];
  //         }
  //         o[this.name].push(this.value || "");
  //       } else {
  //         o[this.name] = this.value || "";
  //       }
  //     });
  //     return o;
  //   };
  // })(jQuery);
  $(function () {
    // ipc.send('getCommodity');
    // ipc.on('commodity', function (evt, com) {
    //   $('#ration1').children('option:not(:first)').remove();
    //   $('#ration2').children('option:not(:first)').remove();
    //   $('#ration3').children('option:not(:first)').remove();
    //   commodity(com, 'ration1');
    //   commodity(com, 'ration2');
    //   commodity(com, 'ration3');
    // })

    updateProvinceDD();
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
    $('#ddDistrict').on('change', function () {
      var dist = $(this).val();
      ipc.send('getTehsil', dist)
      ipc.on('tehsil', function (evt, tehsil) {
        $('#ddTehsil').children('option:not(:first)').remove();
        teh(tehsil);
      })
    })
    $('#ddTehsil').on('change', async function () {
      var tehs = $(this).val();
      ipc.send('getUC', tehs)
      ipc.on('uc', function (evt, uc) {
        $('#ddUC').children('option:not(:first)').remove();
        ucListener(uc);
      })
      if($('#ddProgramType').val() == 'sc'){        
        try {
          var _listNsc = await knex('v_geo_active').where({tehsil_id:tehs, SC:1})
          nscList(_listNsc, 'ddHealthHouse');
        } catch (error) {
          console.log(error)
        }
      }
    })
    var ucForHH;
    $('#ddUC').on('change', function () {
      var ucs = $(this).val();
      ucForHH = ucs
      ipc.send('getHealthHouse', ucs)
      ipc.on('hh', function (evt, hh) {
        $('#ddHealthHouse').children('option:not(:first)').remove();
        hhListener(hh);
      })
    })
    $('#ddHealthHouse').on('change', function () {

      var h_id = $(this).val();
      ipc.send("getVillage", h_id);
      ipc.on("haveVillage", (evt, _villages) => {
        $("#ddVillageName")
          .children("option:not(:first)")
          .remove();
        villListener(_villages);

      });
      ipc.send('getHealthHouseType', h_id)
      ipc.on('hhType', function (evt, hh) {
        hhTypeListener(h_id, hh);
      })
    })

  });
  $(function () {
    let getOtp = filter => {
      return new Promise((resolve, reject) => {
        ipc.send("allOtpTest", filter);
        ipc.on("allOtpTest", (e, result) => {
          // console.log(result);
          if (result.err) {
            reject(result.err);
            ipc.removeAllListeners("allOtpTest");
          } else {
            var s = {
              data: result.result.data,
              itemsCount: result.result.itemsCount[0].total
            };
            resolve(s);
            ipc.removeAllListeners("allOtpTest");
          }
        });
      });
    };
    let delOtp = item => {
      return new Promise((resolve, reject) => {
        console.log(item)
        ipc.send("deleteOtpAdd", item.otp_id);
        ipc.on("deleteOtpAdd", (e, result) => {
          if (result.err) {
            // console.log(result.err)
            reject(result.err);
            ipc.removeAllListeners("deleteOtpAdd");
          } else {
            resolve(result.result);
            $("#otpAddUpdForm")
              .get(0)
              .reset();
            $("#otpAddUpdForm select").val("");
            $("#jsGrid")
              .jsGrid("render")
              .done(function () {
                console.log("rendering completed and data loaded");
              });
            ipc.removeAllListeners("deleteOtpAdd");
          }
        });
      });
    }
    var MyDateField = function (config) {
      jsGrid.Field.call(this, config);
    };

    MyDateField.prototype = new jsGrid.Field({
      css: "date-field", // redefine general property 'css'
      align: "center", // redefine general property 'align'

      sorter: function (date1, date2) {
        return new Date(date1) - new Date(date2);
      },
      itemTemplate: function (value) {
        return new Date(value).toJSON().split('T')[0];
      },

      // filterTemplate: function(value) {
      //   return (this._filterPicker = $("<input>")
      //     .datepicker()
      //     .datepicker("setDate", new Date(value)));
      // },
      insertTemplate: function (value) {
        return (this._insertPicker = $("<input>").datepicker({
          defaultDate: new Date()
        }));
      },

      editTemplate: function (value) {
        return this._editPicker = $("<input>").datepicker({
          format: 'MM/DD/YYYY'
        }).datepicker("setDate", new Date(value));
      },

      insertValue: function () {
        return this._insertPicker.datepicker("getDate").toJSON().split('T')[0];
      },

      editValue: function () {
        return this._editPicker.datepicker("getDate").toJSON().split('T')[0];
      }

      // editTemplate: function(value) {
      //   return (this._editPicker = $("<input>")
      //     .datepicker()
      //     .datepicker("setDate", new Date(value)));
      // },

      // insertValue: function() {
      //   return this._insertPicker.datepicker("getDate").toISOString();
      // },

      // editValue: function() {
      //   return this._editPicker.datepicker("getDate").toISOString();
      // },
      // filterValue: function() {
      //   return this._filterPicker.datepicker("getDate").toISOString();
      // }
    });
    jsGrid.fields.date = MyDateField;
    var prog_type = [{
        name: 'All',
        value: ''
      },
      {
        name: 'TSFP',
        value: 'sfp'
      },
      {
        name: 'TSFP-PLW',
        value: 'sfp_plw'
      },
      {
        name: 'OTP',
        value: 'otp'
      }, {
        name: 'NSC',
        value: 'sc'
      }
    ];
    $("#jsGrid").jsGrid({
      width: "100%",
      height: "300px",
      filtering: true,
      // inserting: true,
      // editing: true,
      // sorting: true,
      paging: true,
      autoload: true,
      pageLoading: true, // this is the clue
      pageSize: 10,
      pageButtonCount: 5,
      confirmDeleting: true,
      deleteConfirm: "Do you really want to delete Patient Record? This will also delete all related information.",
      controller: {
        loadData: function (filter) {
          // console.log(filter);
          // console.log("loaddata", site_id);
          ipc.send("allOtpTest", filter);
          return getOtp(filter);
        },
        deleteItem: function (item) {
          return delOtp(item);
        }
      },
      fields: [{
          name: "prog_type",
          title: 'Program Type',
          type: 'select',
          items: prog_type,
          textField: 'name',
          valueField: 'value',
          width: 50
        },
        {
          name: "province",
          title: "Province",
          type: "text",
          width: 50
        },
        {
          name: "district_name",
          title: "District",
          type: "text",
          width: 50
        },
        {
          name: "tehsil_name",
          title: "Tehsil",
          type: "text",
          width: 50
        },
        {
          name: "uc_name",
          title: "Uion Council",
          type: "text",
          width: 50
        },
        {
          name: "site_village",
          title: "Village",
          type: "text",
          width: 50,
          editing: false
        },

        {
          name: "reg_id",
          title: "Reg #",
          type: "text",
          width: 50,
          editing: false
        },
        {
          name: "p_name",
          title: "Patient Name",
          type: "text",
          width: 50,
          editing: false
        },
        {
          name: "reg_date",
          title: "Reg: Date",
          type: "date",
          width: 50,
          filtering: false
          // editing: false
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

        }, {
          name: "upload_date",
          title: "Upload Date",
          type: "number",
          filtering: false,
        },
        {
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
          modeSwitchButton: false
        }
      ],
      rowClick: async function (args) {
        // console.log(args)
        var date1 = new Date(args.item.upload_date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        diffDays = (args.item.upload_status == 1) ? diffDays : 0;
        var _allowedDays = parseInt(window.sessionStorage.getItem('AllowedDays'));
        var newTempDays = true
        if (newTempDays) {
          this.editItem(args.item);
          var data = args.item;
          ipc.send("getCommodity", data.prog_type);
          ipc.on('commodity', async function (evt, com) {
            $('#ration1').children('option:not(:first)').remove();
            $('#ration2').children('option:not(:first)').remove();
            $('#ration3').children('option:not(:first)').remove();

            //   district.district.forEach(el=>{
            // $('#ddDistrict').append(`<option value="${el.id}">${el.districtName}</option>`);              
            //   })
            // dist(district);
            await commodity(com, 'ration1');
            await commodity(com, 'ration2');
            await commodity(com, 'ration3');
          });
          $("#hh_id").val(data.hh_id);
          $("#travel_time_minutes").val(data.travel_time_minutes);
          $("#is_mother_alive").val(data.is_mother_alive);
          $("#ddProgramType").val(data.prog_type);
          if (data.prog_type === 'sc') {
            nscAdmissionLogic('muac','ration1','quantity1','history','clinical_examination','ent_reason','ref_type','age','ddUC','ddVillageName','ddHealthHouse','ddTehsil')
          } else if (data.prog_type === 'otp') {
            otpAdmissionLogic('muac','oedema','history','clinical_examination','ent_reason','ref_type','age','ddUC','ddVillageName')
          }
        //   if (data.prog_type == 'sc') {
        //     $("#ddHealthHouse").attr("disabled", false);
        //     $("#ddUC").attr("disabled", true);
        //     $("#ddVillageName").attr('disabled', true);
        //     $("#ddVillageName").val(data.site_village);
        //     $('#nsc_otp_id').val(data.nsc_otp_id);
        //     $('#ref_type_other').val(data.ref_type_other);
            
        //     $("#ddHealthHouse").val(data.site_id);
        //     $("#ddUC").val(data.uc_id);
        //     $("#ent_reason").children('option:not(:first)').remove();
        //     $("#ent_reason").append(`
        // <option value="new_add"> New Admission</option>
        // <option value="transfer_in"> Transfer In</option>
        // <option value="transfer_in_from_otp"> Transfer In From OTP </option>
        // <option value="readnission"> Readmission</option>
        // <option value="defaulted"> Defaulted</option> 
        // `);
        //     $("#ref_type").children('option:not(:first)').remove();
        //     $("#ref_type").append(`
        // <option value="ref_by_otp">OTP</option>
        // <option value="opd">OPD</option>
        // <option value="ped_wards">Pediatric Wards</option>
        // <option value="other">Other</option>
        // `);
        //     if (data.ent_reason == "transfer_in_from_otp") {
        //       $("#nsc_tranfer_from_otp_div").css("display", "");
        //       $('#nsc_otp_id').attr("required", true);
        //     }
        //   } else {
        //     $("#ddHealthHouse").attr("disabled", false);
        //     $("#ddUC").attr("disabled", false);
        //     $("#ddHealthHouse").children("option:not(:first)").remove();
        //     $("#ddUC").children("option:not(:first)").remove();
        //     $("#ddVillageName").children("option:not(:first)").remove();
        //     $("#ddVillageName").attr('disabled', false);


        //   };
          console.log(data)
          // villListener(data.)
          // villListener(data.site_id);
          // setTimeout($("#ddVillageName").val(data.site_village), 200)
          // $("#ddVillageName").val(data.site_village);
          $("#reg_date").val(data.reg_date);
          $("#reg_id").val(data.reg_id);
          $("#f_or_h_name").val(data.f_or_h_name);
          $("#p_name").val(data.p_name);
          $("#cnic").val(data.cnic);
          $("#cnt_number").val(data.cnt_number);
          $("#address").val(data.address);
          $("#age").val(data.age);
          $("#gender").val(data.gender);
          // $("#village").val(data.site_village);
          data.plw_type === null ?
            $("#plw_type").attr("disabled", true) :
            $("#plw_type").val(data.plw_type);
          // $('#plw_type').val(data.plw_type)
          $("#ent_reason").val(data.ent_reason);
          if (data.ent_reason == 'other') {
            $("#entry_reason_other_div").css('display', '');
            $("#entry_reason_other").attr('required', true);
            $("#entry_reason_other").val(data.entry_reason_other);
          } else {
            $("#entry_reason_other_div").css("display", "none");
            $("#entry_reason_other").attr("required", false);
            $("#entry_reason_other").empty();

          }

          $("#ref_type").val(data.ref_type);
          if (data.ref_type == "other") {
            $("#ref_type_other_div").css("display", "");
            $("#ref_type_other").attr("required", true);
            $("#ref_type_other").val(data.ref_type_other);
          } else if (data.ref_type == "lhw" || data.ref_type == "chw") {
            $('.community_worker').css('display', 'block')
          } else {
            $("#ref_type_other_div").css("display", "none");
            $("#ref_type_other").attr("required", false);
            $("#ref_type_other").empty();


          }
          $("#weight").val(data.weight);
          $("#height").val(data.height);
          $("#oedema").val(data.oedema);
          $("#muac").val(data.muac);
          $("#diarrhoea").val(data.diarrhoea);
          $("#vomiting").val(data.vomiting);
          $("#cough").val(data.cough);
          $("#appetite").val(data.appetite);
          $("#daily_stool").val(data.daily_stool);
          $("#pass_urine").val(data.pass_urine);
          $("#b_feeding").val(data.b_Feeding);
          $("#od_swol_time").val(data.od_swol_time);
            if(data.age >= 9){
              $('#measels').attr('disabled', true)
              // $('#measels').val(data.measels)
            }else{
              $('#measels').attr('disabled', false)
              $('#measels').val(data.measels)
            }

          $("#otp_id").val(data.otp_id);
          $('#other_com_name').val(data.other_com_name);
          $('#other_com_qty').val(data.other_com_qty);
          $('#nsc_old_otp_id').val(data.nsc_old_otp_id);
          $('#lhw_code').val(data.lhw_code);
          $('#lhw_name').val(data.lhw_name);
          $('#lhw_cnt_number').val(data.lhw_cnt_number);
          $('#resp_rate').val(data.resp_rate);
          $('#chest_in_drawing').val(data.chest_in_drawing);
          $('#temp').val(data.temp);
          $('#conjuctives').val(data.conjuctives);
          $('#eyes').val(data.eyes);
          $('#dehyderation').val(data.dehyderation);
          $('#ears').val(data.ears);
          $('#mouth').val(data.mouth);
          $('#disability').val(data.disability);
          if (data.lymph_nodes) {
            $('#lymph_nodes').val(data.lymph_nodes.split(',')).trigger('change');
            
          }
          if (data.skin_problems) {
            
            $('#skin_problem').val(data.skin_problems.split(',')).trigger('change');
          }
          $('#extemities').val(data.extemities);
          // updateProvinceDD();
          $("#ddProvince").val(data.province_id);
          // console.log(data.ration1)
          setTimeout(qtz, 200)

          function qtz() {

            $("#ration1").val(data.ration1);
            $("#quantity1").val(data.quantity1);
            $("#ration2").val(data.ration2);
            $("#quantity2").val(data.quantity2);
            $("#ration3").val(data.ration3);
            $("#quantity3").val(data.quantity3);
          }
          if (data.ent_reason == "transfer_in_from_nsc" || data.ent_reason == "return_def") {
            $("#nsc_old_otp_id_div").css('display', '');
            $("#nsc_old_otp_id").attr("hidden", false);
          } else {
            $("#nsc_old_otp_id_div").css('display', 'none');

            $("#nsc_old_otp_id").attr("hidden", true);
          }

          $("#ddDistrict")
            .children("option:not(:first)")
            .remove();
          $("#ddDistrict").append(
            `<option value="${data.district_id}" selected>${
            data.district_name
          }</option>`
          );
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

         
          if(data.progType == 'sc'){        
            try {
              var _listNsc = await knex('v_geo_active').where({tehsil_id:tehs, SC:1})
              nscList(_listNsc, 'ddHealthHouse');
            } catch (error) {
              console.log(error)
            }
          }else{
 // $("#ddUC").val(data.uc_id);
 $("#ddHealthHouse")
 .children("option:not(:first)")
 .remove();
$("#ddHealthHouse").append(
 `<option value="${data.site_id}" selected>${
 data.site_name
}</option>`
);
          }
          
          $("#ddVillageName").append(
            `<option value="${data.site_village}" selected>${
            data.site_village
          }</option>`
          );
        } else {
          alert('This could not be edited b/c its been more than 5 days since uploaded')

        }
        // $("#ddHealthHouse").val(data.site_id);
        // $("#ddDistrict")
        //   .children("option:not(:first)")
        //   .remove();
        // console.log(args.item);
      },
      onItemDeleting: function (args) {
        var date1 = new Date(args.item.upload_date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        diffDays = (args.item.upload_status == 1) ? diffDays : 0;
        // cancel deletion of the item with 'protected' field
        // if (diffDays > 99) {
        //   args.cancel = true;
        //   alert(`Item can't be deleted b/c it been uploaded for more than 5 days`)
        // }
      }
    });


  })

  $("#otpAddUpdSubmit").on("click", async (e) => {
    console.log("clicked");
    $("#otpAddUpdForm").validate();

    if ($("#otpAddUpdForm").valid()) {
      var otpAddUpdFormData = $("#otpAddUpdForm").serializeFormJSON();
      console.log(otpAddUpdFormData)
      
      if (otpAddUpdFormData['skin_problems[]']) {
        otpAddUpdFormData.skin_problems = otpAddUpdFormData['skin_problems[]'].toString();
        
        delete otpAddUpdFormData['skin_problems[]']
      }
      if ( otpAddUpdFormData['lymph_nodes[]']) {
        otpAddUpdFormData.lymph_nodes = otpAddUpdFormData['lymph_nodes[]'].toString();
        
        delete otpAddUpdFormData['lymph_nodes[]']
      }
      if ($("#ddProgramType").val() == 'otp') {

        var chk_dist_teh_uc_otp = await knex('v_geo').where({
          district_id: $('#ddDistrict').val(),
          tehsil_id: otpAddUpdFormData.tehsil_id,
          uc_id: $('#ddUC').val(),
          site_id: otpAddUpdFormData.site_id
        });

        var chk_village = await knex('tblVillages').where({
          district: $('#ddDistrict').val(),
          tehsil: otpAddUpdFormData.tehsil_id,
          uc: $('#ddUC').val(),
          site: otpAddUpdFormData.site_id,
          villageName: otpAddUpdFormData.site_village
        })

        if (chk_dist_teh_uc_otp.length < 1 || chk_village.length < 1) {
          alert('Please check location details, either districts, tehsil, uc and site are not updated respectively or village does not exist in nutrition site')
        } else {
          console.table(otpAddUpdFormData);
          ipc.send("submitOtpAddUpd", otpAddUpdFormData);
          ipc.removeAllListeners("submitOtpAddUpd");
          $("#otpAddUpdForm")
            .get(0)
            .reset();
          $("#otpAddUpdForm select").val('');

          $("#jsGrid")
            .jsGrid("render")
            .done(() => {
              console.log("js grid is rendered");
            });
        }


      } else if ($("#ddProgramType").val() == 'sc') {
        console.table(otpAddUpdFormData);
        ipc.send("submitOtpAddUpd", otpAddUpdFormData);
        ipc.removeAllListeners("submitOtpAddUpd");
        $("#otpAddUpdForm")
          .get(0)
          .reset();
        $("#otpAddUpdForm select").val('');

        $("#jsGrid")
          .jsGrid("render")
          .done(() => {
            console.log("js grid is rendered");
          });
      }
    }

    // addScrChildTemplate()
    e.preventDefault();
  });
  // $('#otpAddSubmit').on('click', (e)=>{
  //   $('#otpAddForm').validate();
  //   if($('#otpAddForm').valid()){
  //     var otpAddFormData = $('#otpAddUpdForm').serializeFormJSON();
  //     ipc.send('submitOtpAddUpd', otpAddFormData);
  //     ipc.removeAllListeners('submitOtpAdd')
  //     setTimeout(otpAddTemplate, 3000);
  //   }
  //     // addScrChildTemplate()
  //   e.preventDefault();
  // })
  function rusfOnWeigth(_weight) {
    // console.log(_weight);
    if ($('#ddProgramType').val() == 'otp') {
      $('#ration1').val('RUTF (OTP)');
      var qty = $('#quantity1');
      if (_weight >= 3.5 && _weight <= 3.9) {
        qty.val(11);
      } else if (_weight >= 4 && _weight <= 5.4) {
        qty.val(14);
      } else if (_weight >= 5.5 && _weight <= 6.9) {
        qty.val(18)
      } else if (_weight >= 7 && _weight <= 8.4) {
        qty.val(21)
      } else if (_weight >= 8.5 && _weight <= 9.4) {
        qty.val(25)
      } else if (_weight >= 9.5 && _weight <= 10.4) {
        qty.val(28)
      } else if (_weight >= 10.5 && _weight <= 11.9) {
        qty.val(32)
      } else if (_weight >= 12) {
        qty.val(35)
      }
    }
  }

  $('#weight').on('change', function (e) {
    var _weight = $(this).val();
    rusfOnWeigth(_weight);
  });
  $("#ent_reason").on('change', function () {
    if ($(this).val() == 'other') {
      $("#entry_reason_other_div").css('display', '');
      $("#entry_reason_other").attr('required', true);
    } else if ($(this).val() == "transfer_in_from_otp") {
      $("#nsc_tranfer_from_otp_div").css("display", "");
      $("#nsc_otp_id").attr("required", true);

    } else if ($(this).val() == "transfer_in_from_nsc" || $(this).val() == "return_def") {
      $("#nsc_tranfer_from_otp_div").css("display", "none");
      $("#nsc_otp_id").attr("required", false);
    } else {
      $("#entry_reason_other_div").css("display", "none");
      $("#entry_reason_other").attr("required", false);
    }
  });
  $("#ref_type").on("change", function () {
    if ($(this).val() == "other") {
      $("#ref_type_other_div").css("display", "");
      $("#ref_type_other").attr("required", true);
    } else {
      $("#ref_type_other_div").css("display", "none");
      $("#ref_type_other").attr("required", false);
    }
  });
  $("#ddProgramType").on("change", function () {
    if ($(this).val() == "sc") {
      // $("#ddHealthHouse").attr("disabled", true);
      $("#ddUC").attr("disabled", true);
      $("#ddVillageName").attr('disabled', true);
    } else {
      // $("#ddHealthHouse").attr("disabled", false);
      $("#ddUC").attr("disabled", false);
      $("#ddVillageName").attr("disabled", false);

    }
  });
  $('#ent_reason').on('change', function (e) {
    var progType = $('#ddProgramType');
    var muac = $('#muac');
    if ($(this).val() == 'moved_in' || $(this).val() == 'tranfer_in_other_otp') {

      // if(progType.val() == 'otp' & $(this).val() == 'moved_in'){
      muac.removeAttr('max')
      muac.attr('min', 0)
    } else {
      muac.attr('max', 11.4)
      muac.attr('min', 0)
    }

  })
  $('#oedema').on('change', function (e) {
    var progType = $('#ddProgramType');
    var muac = $('#muac');
    if (progType.val() == 'otp' || progType.val() == 'sc'   && $(this).val() !== 'absent') {
      muac.attr('max',25)
      muac.attr('min', 0)
    } else if  (progType.val() == 'sc'  && $(this).val() == 'absent') {
      muac.attr('max', 15)
      muac.attr('min', 0)
    }else {
      muac.attr('max', 11.4)
      muac.attr('min', 0)
    }
  })

  $('#ref_type').on('change', function () {
    if ($(this).val() == 'lhw' || $(this).val() == 'chw') {
      $('.community_worker').css('display', 'block')
    } else {
      $('.community_worker').css('display', 'none')

    }
  })
  // $('#age').on('change', function(){
  //   if($(this).val() >= 9){
  //     ('#measels').attr('disabled', true)
  //     // $('#measels').val(data.measels)
  //   }else{
  //     ('#measels').attr('disabled', false)
  //     // $('#measels').val(data.measels)
  //   }
  // })
  $(function () {
    $('#AddEditListExport').on('click',async function () {
      try {
        var data = $("#jsGrid").jsGrid("option", "data");
        //   await knex("v_otpAddmision2").select('district_name', 'tehsil_name', 'uc_name', 'site_name', 'site_village', 'reg_date', 'p_name', 'f_or_h_name', 'cnic', 'address', 'cnt_number', 'age', 'gender', 'ent_reason', 'ref_type', 'oedema', 'muac', 'diarrhoea', 'vomiting', 'cough', 'appetite', 'daily_stool', 'pass_urine', 'b_Feeding', 'weight', 'updated_at', 'upload_status', 'username', 'org_name', 'project_name', 'resp_rate', 'chest_in_drawing', 'temp', 'conjuctives', 'eyes', 'dehyderation', 'ears', 'mouth', 'lymph_nodes', 'disability', 'skin_problems', 'extemities', 'measels').where({
        //   is_deleted: 0
        // })
        // .whereRaw(`otp_id NOT IN (select otp_id from tblOtpExit where is_deleted = 0)`)
        // var data = $('#txt').val();
        if (data.length == 0)
          return;
        JSONToCSVConvertor(data, "admision_list", true);

      } catch (error) {
        console.log(error)
        alert('Data Fetch error')
      }


      // JSONToCSVConvertor(data, "Vehicle Report", true);
    });
  });
};