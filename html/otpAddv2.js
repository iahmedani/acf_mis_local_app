var uuid = require('uuid/v4');
const { nscAdmissionLogic,
  otpAdmissionLogic,
  changeMuacOnOdema, hhOnProgType } = require('./utils/utilAdd');

module.exports.initOtpAdd = function () {
  var knex = require('../mainfunc/db')
  $(":input").inputmask();
  // $("#phone").inputmask({ "mask": "(999) 999-9999" });
  $(function () {
    var datePickerId = document.getElementById('reg_date');
    datePickerId.max = new Date().toISOString().split("T")[0];
  });
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
    $('#ddProgramType').on('change', function () {
      var prog = $(this).val();
      ipc.send('getCommodity', prog)
      ipc.on('commodity', function (evt, com) {
        $('#ration1').children('option:not(:first)').remove();
        $('#ration2').children('option:not(:first)').remove();
        $('#ration3').children('option:not(:first)').remove();
        commodity(com, 'ration1');
        commodity(com, 'ration2');
        commodity(com, 'ration3');
      })
      if (prog === 'sc') {
        nscAdmissionLogic('muac','ration1','quantity1','history','clinical_examination','ent_reason','ref_type','age','ddUC','ddVillageName','ddHealthHouse','ddTehsil')
      } else if (prog === 'otp') {
        otpAdmissionLogic('muac','oedema','history','clinical_examination','ent_reason','ref_type','age','ddUC','ddVillageName')
      } else if (prog === 'sfp') {
        $('#age option[value="above59"]').attr('disabled', true)
        $('#age option[value="below_6"]').attr('disabled', true)
        $('#plw_type').attr('disabled', true);
        $('#muac').attr('max', '12.5');
        $('#muac').attr('min', '11.5');
        $('#oedema').children('option:not(:eq(1))').remove();
      } else {
        var age = $('#age').val();
        $('#age option[value="above59"]').attr('disabled', true)
        $('#plw_type').attr('disabled', false);
        $('#muac').attr('max', '30');
        $('#muac').attr('min', '0');
        $('#age option[value="above59"]').attr('disabled', false)
        $('#age option[value="below_6"]').attr('disabled', false)
        $('#oedema').empty();
        $('#oedema').append(`<option selected disabled>Choose</option>
                    <option value="absent">absent</option>
                    <option value="plus_1">&plus;(1)</option>
                    <option value="plus_2">&plus;&plus;(2)</option>
                    <option value="plus_3">&plus;&plus;&plus;(3)</option>`)

      }
    })
    $('#oedema').on('change', function (e) {
      var progType = $('#ddProgramType');
      changeMuacOnOdema($(this).val(), 'muac', progType.val(), $('#ent_reason').val());
      // var muac = $('#muac');
      // if ((progType.val() == 'otp' || progType.val() == 'sc') && $(this).val() !== 'absent') {
      //   muac.removeAttr('max')
      //   muac.attr('min', 0)
      // } else if(progType.val() == 'otp' && $(this).val() == 'absent') {
      //   muac.attr('max', 11.4)
      //   muac.attr('min', 0)
      // }else if ($(this).val() == 'absent' && progType.val() == 'sc'){
      //   muac.attr('max', 25)
      //   muac.attr('min', 0)
      // }
    })

  })

  $('#otpAddForm').on('submit', async (e) => {
    e.preventDefault();
    $('#otpAddForm').validate();
    if ($('#otpAddForm').valid()) {
      var otpAddFormData = $('#otpAddForm').serializeFormJSON();
      otpAddFormData.otp_id = uuid();
      
      if (otpAddFormData['skin_problems[]']) {
        otpAddFormData.skin_problems = otpAddFormData['skin_problems[]'].toString();
        
        delete otpAddFormData['skin_problems[]']
      }
      if ( otpAddFormData['lymph_nodes[]']) {
        otpAddFormData.lymph_nodes = otpAddFormData['lymph_nodes[]'].toString();
        
        delete otpAddFormData['lymph_nodes[]']
      }
      if ($('#ddProgramType').val() == 'otp') {
        var check = await knex('tblOtpAdd').where({
          site_id: otpAddFormData.site_id,
          reg_id: otpAddFormData.reg_id,
          is_deleted: 0
        })
        if (check.length > 0) {
          $('#regIdInfo').css('display', '')
        } else {
          $('#regIdInfo').css('display', 'none')
          console.log(otpAddFormData)

          ipc.send('submitOtpAdd', otpAddFormData);
          ipc.removeAllListeners('submitOtpAdd');

          $('.clr').val("");
          $(".cld").val("")
        }
      } else if ($('#ddProgramType').val() == 'sc') {

        var check = await knex('tblOtpAdd').where({
          tehsil_id: otpAddFormData.tehsil_id,
          reg_id: otpAddFormData.reg_id,
          is_deleted: 0
        })
        if (check.length > 0) {
          $('#regIdInfo').css('display', '')
        } else {
          $('#regIdInfo').css('display', 'none')
          console.log(otpAddFormData)

          ipc.send('submitOtpAdd', otpAddFormData);
          ipc.removeAllListeners('submitOtpAdd');

          $('.clr').val("");
          $(".cld").val("")
        }
      }
    }
  })

  function rusfOnWeigth(_weight) {
    console.log(_weight);
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
  })

  $('#ddProgramType').on('change', function () {
    var progType = $(this).val();
    if (progType == 'sfp_Plw') {
      $("#labAge").empty();
      $("#labAge").text('(in years)');
      $("#age").attr('min', false);
      $("#age").attr('max', false);

    } else {
      $("#labAge").empty();
      $("#labAge").text('(in months)');
      $("#age").attr('min', '6');
      $("#age").attr('max', '59');
    }
  })
  // $("#oedema").on('change', function () {
  //   var val = $(this).val();
  //   var muacEl = $('#muac');
  //   var progType = $("#ddProgramType").val();
  // var muacEl = $('#muac');
  //   if (val == 'absent') {
  //     if (progType == 'sc' || progType == 'otp') {
  //       muacEl.attr('max', "15");
  //       muacEl.attr('min', "1");
  //     } else if (progType == 'sfp') {
  //       muacEl.attr("max", "12.4");
  //       muacEl.attr("min", "11.5");
  //     } else {
  //       muacEl.attr("max", "21");
  //       muacEl.attr("min", "0");
  //     }
  //   } else {
  //     muacEl.attr('max', false);
  //     muacEl.attr('min', false);
  //   }
  // });

  $("#ent_reason").on('change', function () {
    var entReason = $("#ent_reason").val();
    if (entReason == 'other') {
      $("#entry_reason_other_div").css('display', '');
      $("#entry_reason_other").attr('required', true);
    } else {
      $("#entry_reason_other_div").css("display", "none");
      $("#entry_reason_other").attr("required", false);
    }

    var progType = $('#ddProgramType');
    var muac = $('#muac');
    // if (progType.val() == 'otp' && ($(this).val() == 'moved_in' || $(this).val() == 'tranfer_in_other_otp')) {
    //   muac.attr('max', 25);
    //   muac.attr('min', 0)
    // } else {
    //   muac.attr('max', 11.4)
    //   muac.attr('min', 0)
    // }

    if ($(this).val() == "transfer_in_from_nsc" || $(this).val() == "return_def") {
      $("#nsc_old_otp_id_div").css('display', '');
      $("#nsc_old_otp_id").attr("hidden", false);
    } else {
      $("#nsc_old_otp_id_div").css("display", "none");
      $("#nsc_old_otp_id").attr("hidden", true);
    }

    if (progType == 'sc' && $(this).val() != 'transfer_in_from_otp') {
      $('#ref_type option[value="ref_by_otp"]').attr('disabled', true);
    } else {
      $('#ref_type option[value="ref_by_otp"]').attr('disabled', false);
    }


  });

  // $("#ent_reason").on('change',function () {
  //   var entReason = $("#ent_reason").val();
  //   console.log(entReason)
  //   var prog = $("#ddProgramType").val();
  //   if (prog == "sc" && (entReason == "transfer_in_from_otp" || entReason == 'readnission' || entReason == 'defaulted')) {
  //     // $("#ddUC")
  //     //   .attr("disabled", false)
  //     //   .attr("required", true);
  //     // $("#ddVillageName")
  //     //   .attr("disabled", false)
  //     //   .attr("required", true);
  //     // $("#ddHealthHouse")
  //     //   .attr("disabled", false)
  //     //   .attr("required", true);
  //     $("#nsc_tranfer_from_otp_div").css("display", "");
  //     $('#nsc_otp_id').attr("required", true);
  //   } else if (prog == "sc" && (entReason == "new_add" || entReason == 'ransfer_in')) {
  //     // $("#ddUC")
  //     //   .attr("disabled", true)
  //     //   .attr("required", false);
  //     // $("#ddVillageName")
  //     //   .attr("disabled", true)
  //     //   .attr("required", false);
  //     // $("#ddHealthHouse")
  //       // .attr("disabled", true)
  //       // .attr("required", false);
  //     $("#nsc_tranfer_from_otp_div").css("display", "none");
  //     $("#nsc_otp_id").attr("required", false);
  //   } else if (prog != "sc") {
  //     $("#nsc_tranfer_from_otp_div").css("display", "none");
  //     $("#nsc_otp_id").attr("required", false);
  //   }
  // });

  // $("#ref_type").on("change", function () {
    
  // });
  // $("#ddProgramType").on("change", function () {
  //   if ($(this).val() == "sc") {
  //     // $("#ddHealthHouse").attr("disabled", true);
  //     $("#ddUC").attr("disabled", true);
  //     $("#ddVillageName").attr('disabled', true);
  //   } else {
  //     // $("#ddHealthHouse").attr("disabled", false);
  //     $("#ddUC").attr("disabled", false);
  //     $("#ddVillageName").attr("disabled", false);

  //   }
  // });
  $('#ddVillageName').on("change", function () {
    var village = $(this).val();
    $('#address').val(village);
  })

  $('#ref_type').on('change', function () {
    if ($(this).val() == "other") {
      $("#ref_type_other_div").css("display", "");
      $("#ref_type_other").attr("required", true);
    } else if ($(this).val() == 'lhw' || $(this).val() == 'chw') {
      $('.community_worker').css('display', 'block')
    } else {
      $('.community_worker').css('display', 'none')
      $("#ref_type_other_div").css("display", "none");
      $("#ref_type_other").attr("required", false);
    }
  })
  // $('#age').on('change',function(){
  //   if($(this).val() >= 9){
  //     $('#measels').attr('disabled', true)
  //     // $('#measels').val(data.measels)
  //   }else{
  //     $('#measels').attr('disabled', false)
  //     // $('#measels').val(data.measels)
  //   }
  // })
}