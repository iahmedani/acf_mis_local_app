const knex = require('../mainfunc/db');
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
module.exports.initScrChildrenReport = function () {
  // function singleDataTable ( _data){

  //   $('#scrChildNewSingle_aapN').dataTable().fnClearTable();
  //   $('#scrChildNewSingle_aapN').dataTable().fnAddData(_data);
  // }
  
  $(function () {
  //   $('#scrChildNewSum').DataTable({
  //     dom: 'Bfrtip',
  //     buttons: [
  //         'copy', 'csv', 'excel', 'pdf', 'print'
  //     ]
  // });
    // $("#scrChildNewSingle_aapN")
    // .on('processing.dt', function (e, settings, processing) {
    //   $('.spinner-border').css('display', processing ? 'block' : 'none');
    // }).DataTable({
    //   data: [],
    //   // dom: "Bfrtip",
    //   // buttons: ["copy", {
    //   //   extend: "csv",
    //   //   title: 'Children Screening Report_' 
    //   // }, {
    //   //   extend: "excel",
    //   //   title: 'Chilren Screening Report_' 
    //   // }],
    //   retrieve: true,
    //   paging: true,
    //   columns: [
    //     {
    //       title:'Province',
    //       data:'province'
    //     }
    //     ,{
    //       title:'District',
    //       data:'district_name'
    //     }
    //     ,{
    //       title:'Tehsil',
    //       data:'tehsil_name'
    //     }
    //     ,{
    //       title:'UC',
    //       data:'uc_name'
    //     }
    //     ,{
    //       title:'Catchment Population',
    //       data:'catchment_population'
    //     }
    //     ,{
    //       title:'Supervisor Name',
    //       data:'sup_name'
    //     }
    //     ,{
    //       title:'Supervisor code',
    //       data:'sup_code'
    //     }
    //     ,{
    //       title:'Staff Name',
    //       data:'staff_name'
    //     }
    //     ,{
    //       title:'Staff code',
    //       data:'staff_code'
    //     }
    //     ,{
    //       title:'Entry Type',
    //       data:'ent_type'
    //     }
    //     ,{
    //       title:'Total Screened (Boys)',
    //       data:'total_scr_boys'
    //     }
    //     ,{
    //       title:'Total Screened (Girls)',
    //       data:'total_scr_girls'
    //     }
    //     ,{
    //       title:'Normal (6-23 Boys)',
    //       data:'normal_boys_623'
    //     }
    //     ,{
    //       title:'Normal (6-23 Girls)',
    //       data:'normal_girls_623'
    //     }
    //     ,{
    //       title:'Normal (24-59 Boys)',
    //       data:'normal_boys_2459'
    //     }
    //     ,{
    //       title:'Normal (24-59 Girls)',
    //       data:'normal_girls_2459'
    //     }
    //     ,{
    //       title:'MAM (6-23 Boys)',
    //       data:'mam_boys_623'
    //     }
    //     ,{
    //       title:'MAM (6-23 Girls)',
    //       data:'mam_girls_623'
    //     }
    //     ,{
    //       title:'MAM (24-59 Boys)',
    //       data:'mam_boys_2459'
    //     }
    //     ,{
    //       title:'MAM (24-59 Girls)',
    //       data:'mam_girls_2459'
    //     }
    //     ,{
    //       title:'SAM (6-23 Boys)',
    //       data:'sam_without_comp_boys_623'
    //     }
    //     ,{
    //       title:'SAM (6-23 Girls)',
    //       data:'sam_without_comp_girls_623'
    //     }
    //     ,{
    //       title:'SAM (24-59 Boys)',
    //       data:'sam_without_comp_boys_2459'
    //     }
    //     ,{
    //       title:'SAM (24-59 Girls)',
    //       data:'sam_without_comp_girls_2459'
    //     }
    //     ,{
    //       title:'SAM+Comp: (6-23 Boys)',
    //       data:'sam_with_comp_boys_623'
    //     }
    //     ,{
    //       title:'SAM+Comp: (6-23 Girls)',
    //       data:'sam_with_comp_girls_623'
    //     }
    //     ,{
    //       title:'SAM+Comp: (24-59 Boys)',
    //       data:'sam_with_comp_boys_2459'
    //     }
    //     ,{
    //       title:'SAM+Comp: (24-59 Girls)',
    //       data:'sam_with_comp_girls_2459'
    //     }
    //     ,{
    //       title:'Oedema (+,++) (6-23 Boys)',
    //       data:'plus12_oedema_boys_623'
    //     }
    //     ,{
    //       title:'Oedema (+,++) (6-23 Girls)',
    //       data:'plus12_oedema_girls_623'
    //     }
    //     ,{
    //       title:'Oedema (+,++) (24-59 Boys)',
    //       data:'plus12_oedema_boys_2459'
    //     }
    //     ,{
    //       title:'Oedema (+,++) (24-59 Girls)',
    //       data:'plus12_oedema_girls_2459'
    //     }
    //     ,{
    //       title:'Oedema (+++) (6-23 Boys)',
    //       data:'plus3_oedema_boys_623'
    //     }
    //     ,{
    //       title:'Oedema (+++) (6-23 Girls)',
    //       data:'plus3_oedema_girls_623'
    //     }
    //     ,{
    //       title:'Oedema (+++) (24-59 Boys)',
    //       data:'plus3_oedema_boys_2459'
    //     }
    //     ,{
    //       title:'Oedema (+++) (24-59 Girls)',
    //       data:'plus3_oedema_girls_2459'
    //     }
    //     ,{
    //       title:'Oedema (+++) (6-23 Boys)',
    //       data:'plus3_oedema_boys_623'
    //     }
    //     ,{
    //       title:'Oedema (+++) (6-23 Girls)',
    //       data:'plus3_oedema_girls_623'
    //     }
    //     ,{
    //       title:'Oedema (+++) (24-59 Boys)',
    //       data:'plus3_oedema_boys_2459'
    //     }
    //     ,{
    //       title:'Oedema (+++) (24-59 Girls)',
    //       data:'plus3_oedema_girls_2459'
    //     }
    //     ,{
    //       title:'Referred to OTP (S1)',
    //       data:'site_one'
    //     }
    //     ,{
    //       title:'Referred Boys OTP (S1)',
    //       data:'reffer_otp_boys_s1'
    //     }
    //     ,{
    //       title:'Referred Girls OTP (S1)',
    //       data:'reffer_otp_girls_s1'
    //     }
    //     ,{
    //       title:'Referred Boys TSFP (S1)',
    //       data:'reffer_tsfp_boys_s1'
    //     }
    //     ,{
    //       title:'Referred Girls TSFP (S1)',
    //       data:'reffer_tsfp_girls_s1'
    //     }
    //     ,{
    //       title:'Referred to OTP (S1)',
    //       data:'site_two'
    //     }
    //     ,{
    //       title:'Referred Boys OTP (S1)',
    //       data:'reffer_otp_boys_s2'
    //     }
    //     ,{
    //       title:'Referred Girls OTP (S1)',
    //       data:'reffer_otp_girls_s2'
    //     }
    //     ,{
    //       title:'Referred Boys TSFP (S1)',
    //       data:'reffer_tsfp_boys_s2'
    //     }
    //     ,{
    //       title:'Referred Girls TSFP (S1)',
    //       data:'reffer_tsfp_girls_s2'
    //     }
    //     ,{
    //       title:'Referred to NSC1',
    //       data:'nsc_one'
    //     }
    //     ,{
    //       title:'Referred Boys NSC1 (6-23)',
    //       data:'nsc1_boys_623'
    //     }
    //     ,{
    //       title:'Referred Girls NSC1 (6-23)',
    //       data:'nsc1_girls_623'
    //     }
    //     ,{
    //       title:'Referred Boys NSC1 (24-59)',
    //       data:'nsc1_boys_2459'
    //     }
    //     ,{
    //       title:'Referred Girls NSC1 (24-59)',
    //       data:'nsc1_girls_2459'
    //     }
    //     ,{
    //       title:'Referred to NSC2',
    //       data:'nsc_two'
    //     }
    //     ,{
    //       title:'Referred Boys NSC2 (6-23)',
    //       data:'nsc2_boys_623'
    //     }
    //     ,{
    //       title:'Referred Girls NSC2 (6-23)',
    //       data:'nsc2_girls_623'
    //     }
    //     ,{
    //       title:'Referred Boys NSC2 (24-59)',
    //       data:'nsc2_boys_2459'
    //     }
    //     ,{
    //       title:'Referred Girls NSC2 (24-59)',
    //       data:'nsc2_girls_2459'
    //     }
        
    //     ,{
    //       title:'Deworming - Grils',
    //       data:'deworming_girls'
    //     }
        
    //     ,{
    //       title:'Deworming - Boys',
    //       data:'deworming_boys'
    //     }
    //     ,{
    //       title:'MNP - Grils',
    //       data:'mnp_girls'
    //     }
        
    //     ,{
    //       title:'MNP - Boys',
    //       data:'mnp_boys'
    //     }
    //     ,{
    //       title:'Total Follow-ups',
    //       data:'total_followup'
    //     }
        
    //     ,{
    //       title:'Total Exits',
    //       data:'total_exits'
    //     }
        
    //   ]
    // });
    // var datePickerId_end = document.getElementById('end_date');
    // datePickerId_end.max = new Date().toISOString().split("T")[0];
    // var datePickerId_start = document.getElementById('start_date');
    // datePickerId_start.min = new Date(2018,07,01).toISOString().split("T")[0];
   

    // $('#ddInterval').on('change', function () {
    //   var value = $(this).val();
    //   console.log(value);
    //   if (value == 1) {
    //     $('#start_date').attr('disabled', false);
    //     $('#end_date').attr('disabled', false);
    //   } else {
    //     $('#start_date').attr('disabled', true);
    //     $('#end_date').attr('disabled', true);
    //   }
    // })

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
    $('#ddTehsil').on('change', function () {
      var tehs = $(this).val();
      ipc.send('getUC', tehs)
      ipc.on('uc', function (evt, uc) {
        $('#ddUC').children('option:not(:first)').remove();

        ucListener(uc);
      })
    })
    var ucForHH;
    $('#ddUC').on('change', function () {
      var ucs = $(this).val();
      ucForHH = ucs
      ipc.send("getStaffuc", ucs);
      ipc.send("getSupsuc", ucs);

      ipc.on("haveStaffuc", function(evt, staffs) {
        $("#ddStaff_code")
          .children("option:not(:first)")
          .remove();
        staffListeneruc(staffs);
      });
      ipc.on("haveSupsuc", function(evt, _sups) {
        $("#ddSup_code")
          .children("option:not(:first)")
          .remove();
        supListeneruc(_sups);
      });
    })
  });

  $("#ddStaff_code").on("change", function () {
    var staff_code = $(this).val();
    $("#ddStaff_name").val(staff_code);
  });
  $("#ddStaff_name").on("change", function() {
    var staff_code = $(this).val();
    $("#ddStaff_code").val(staff_code);
  });
  $("#ddSup_code").on("change", function () {
    var sup_code = $(this).val();
    $("#ddSup_name").val(sup_code);
  });
  $("#ddSup_name").on("change", function() {
    var sup_code = $(this).val();
    $("#ddSup_code").val(sup_code);
  });

  function prepareQry() {
    var qry = {};
    ($('#ddProvince').val()) ? qry.province_id = $('#ddProvince').val(): '';
    ($('#ddDistrict').val()) ? qry.district_id = $('#ddDistrict').val(): '';
    ($('#ddTehsil').val()) ? qry.tehsil_id = $('#ddTehsil').val(): '';
    ($('#ddUC').val()) ? qry.uc_id = $('#ddUC').val(): '';
    ($('#ddStaff_code').val()) ? qry.staff_code = $('#ddStaff_code').val(): '';
    ($('#ddSup_code').val()) ? qry.sup_code = $('#ddSup_code').val(): '';
    qry.date = {
      x: 'report_month',
      y: [$('#start_date').val(), $('#end_date').val()]
    };
    // console.log(qry);
    return qry;
  }
  $(function () {
    // var  _data =  []
    
    function putSummaryDataToTable(table, array) {
      $(`#${table} td`).each(function () {
        $(this).empty();
      })
      var keys = Object.keys(array[0]);
      keys.forEach(el => {
        $(`#${el}`).text(array[0][el]);
      })
    }
    function putSummaryDataToTableAAP(table, array) {
      $(`#${table} td`).each(function () {
        $(this).empty();
      })

      var keys = Object.keys(array[0]);
      var totals = {};
      keys.forEach(el => {
        array.forEach(_el =>{
          var __x_ = el.replace('boys', '').replace('girls', '');
          if(_el.ent_type == 'new'){
            $(`#new_${el}`).text(_el[el]);
            (totals[`total_${__x_}`]) ? totals[`total_${__x_}`] = totals[`total_${__x_}`] + _el[el]: totals[`total_${__x_}`] = _el[el]
          }else if(_el.ent_type == 'rescreen'){
            $(`#re_${el}`).text(_el[el]);
            (totals[`total_${__x_}`]) ? totals[`total_${__x_}`] = totals[`total_${__x_}`] + _el[el]: totals[`total_${__x_}`] = _el[el]
          }
        })
      })
      console.log(totals)
      var totals_key = Object.keys(totals);
      totals_key.forEach(el=>{
        $(`#${el}`).text(totals[el]);
      })
    }

    function createSingleEntryTable(table, array, headerObj, headerKeys) {
      var html = `<tr>`
      headerObj.forEach(el => {
        html += `<th>${el}</th>`
      })
      html += '</tr>'
      array.forEach(el => {
        html += '<tr>'
        headerKeys.forEach(h => {
          html += `<td>${el[h]}</td>`
        })
        html += '</tr>'
      })
      $(`#${table}`).empty();
      $(`#${table}`).append(html);
    }

    function scrChildReport(qry) {
      return new Promise((resolve, reject) => {
        ipc.send('scrChildReport', (qry));
        ipc.on('scrChildReport', (e, result) => {
          // console.log(result)
          if (result.err) {
            reject(result.err)
            ipc.removeAllListeners('scrChildReport')
          } else {
            resolve(result.result);
            ipc.removeAllListeners('scrChildReport')

          }
        })
      })
    }
    $('#showDataScrReport').on('click', function (e) {
      e.preventDefault();
      // $('#filterDate').validate();
      if ($('#filterDate').valid()) {

        scrChildReport(prepareQry())
          .then(result => {
            // console.log(result.summary)
            putSummaryDataToTableAAP('scrChildNewSum', result.summary)
            // singleDataTable(result.single)
            
          })
          .catch(e => {
            console.log('error occured during summary table creation')
          })
      }
    });

    var exportSummary = $('#exportSummary')
    exportSummary.on('click', function () {
      export_xlsx();
    })
  })
  var exportDetail = $('#exportDetail')

  exportDetail.on('click',  function () {
        var qry = prepareQry();
        myNewExport(qry)
    
  })


 
  /* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
  /*global Uint8Array, console */
  /* exported export_xlsx */
  /* eslint no-use-before-define:0 */
  var XLSX = require('xlsx');
  var electron = require('electron').remote;

  const sheetColsFromJsonObject = function (dataArray) {
    var cols = [];
    var _els = [];
        for (property in dataArray) {
            _els.push(property)
        }
        _els = [...new Set(_els)]
        for (z of _els) {
            cols.push({
                header: z.replace(/_/g, ' ').toUpperCase(),
                key: z,
                width: 18
            })
        }

        return cols
}

  var export_xlsx = (function () {
    // var HTMLOUT = document.getElementById('htmlout');
    var XTENSION = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|")
    return function () {
      var workbook = XLSX.utils.book_new();
      var ws1 = XLSX.utils.table_to_sheet(document.getElementById('scrChildNewSum'));
      XLSX.utils.book_append_sheet(workbook, ws1, "Summary");

      /* convert table 'table2' to worksheet named "Sheet2" */
      // var ws2 = XLSX.utils.table_to_sheet(document.getElementById('scrChildNewSingle_aapN'));
      // XLSX.utils.book_append_sheet(workbook, ws2, "Screening Detail");
      // var wb = XLSX.utils.table_to_book(HTMLOUT);
      var o = electron.dialog.showSaveDialog({
        title: 'Save file as',
        filters: [{
          name: "Spreadsheets",
          extensions: XTENSION
        }]
      });

      console.log(o);
      XLSX.writeFile(workbook, o);
      electron.dialog.showMessageBox({
        message: "Exported data to " + o,
        buttons: ["OK"]
      });
    };
  })();
  void export_xlsx;

  var Excel = require("exceljs");
  function excelStream(res, stream, fileName, sheetName, folderName) {
    const options = {
      filename: `${folderName}/` + fileName + ".xlsx",
      useStyles: false,
      useSharedStrings: false,
      zip: {
        store: false,
      }
    };
    const workbook = new Excel.stream.xlsx.WorkbookWriter(options);       
    const sheet = workbook.addWorksheet(sheetName, { properties: { tabColor: { argb: 'FFC0000' } } });
    var _first = 1;
    stream.on('data', (chunk) => {
      if (_first == 1) {
        var col = sheetColsFromJsonObject(chunk);
        console.log(col);
        sheet.columns = col;
      }
      _first++;
      sheet.addRow(chunk).commit();   
    })
    stream.on('end', () => {
      console.log('stream finished')
      sheet.commit();
      workbook.commit().then(x => {
        var fileLocation_aap = `${folderName}/` + fileName + ".xlsx"
        
        electron.dialog.showMessageBox({
          message: "Exported data to " + fileLocation_aap,
          buttons: ["OK"]
        });
        // electron.dialog.showMessageBox()
        // res.sendFile( `${process.env.APPDATA}/nims_aap/` +fileName+'.xlsx');
        console.log(x)
    })
    // res.send({x:'imran'})
    console.log('fileWrote')
    })
  }
  
  async function createExcel(res, data) {
    const workbook = new Excel.Workbook();
    const WorkSheet = workbook.addWorksheet(data.workSheet_name);
    try {
      var _columns = await getCols(data.data);
      WorkSheet.columns = _columns;
      WorkSheet.addRows(data.data);
      // res.setHeader(
      //   "Content-Type",
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // );
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=" + `${data.workbook_name}.xlsx`
      // );
      workbook.xlsx.write().then(function (data) {
        // res.end();
        console.log("File write done........");
      });
    } catch (error) {
      console.log(error);
    }
  }

  function myNewExport(cond) {
     console.log(cond)
    electron.dialog.showOpenDialog({
      title: 'Please select folder to save detail report',
      properties:['openDirectory']
    }, (givendir) => {
      if (!givendir) {
       alert('Export failed:  Operation was canceled')
      } else {
        var stream = knex.select(['province','district_name','tehsil_name','uc_name','screening_date','ent_type','staff_name','staff_code','sup_name','sup_code','report_month','catchment_population','total_scr_girls','total_scr_boys','new_boys','new_girls','reScreened_boys','reScreened_girls','sam_without_comp_girls_623','sam_without_comp_boys_623','sam_with_comp_girls_623','sam_with_comp_boys_623','mam_girls_623','mam_boys_623','sam_without_comp_girls_2459','sam_without_comp_boys_2459','sam_with_comp_girls_2459','sam_with_comp_boys_2459','mam_girls_2459','mam_boys_2459','reffer_tsfp_girls','reffer_otp_girls','reffer_tsfp_boys','reffer_otp_boys','normal_boys_623','normal_girls_623','normal_boys_2459','normal_girls_2459','plus12_oedema_boys_623','plus12_oedema_girls_623','plus12_oedema_boys_2459','plus12_oedema_girls_2459','plus3_oedema_boys_623','plus3_oedema_girls_623','plus3_oedema_boys_2459','plus3_oedema_girls_2459','nsc_one','nsc1_boys_623','nsc1_girls_623','nsc1_boys_2459','nsc1_girls_2459','nsc_two','nsc2_boys_623','nsc2_girls_623','nsc2_boys_2459','nsc2_girls_2459','username','project','upload_status','is_deleted','report_month','followedup_boys','followedup_girls','exits_boys','exits_girls','other_specify','other_boys','other_girls','upload_date','site_one','site_two','reffer_otp_girls_s1','reffer_otp_girls_s2','reffer_otp_boys_s1','reffer_otp_boys_s2','reffer_tsfp_girls_s1','reffer_tsfp_girls_s2','total_hh','reffer_tsfp_boys_s1','reffer_tsfp_boys_s2','mnp_boys','mnp_girls','total_followup','total_exits','deworming_girls','deworming_boys']).from("v_ScrChildUpd")
        .where(builder => {
          if (!cond.date) {
            builder.where(cond);
          } else {
            var newCond = cond;
            var date;
            if (newCond.date) {
              date = newCond.date;
              delete newCond.date;
            }
            if (date && isEmpty(newCond)) {
              builder.whereBetween("report_month", date.y);
            } else {
              console.log(date);
              builder.where(newCond).whereBetween("report_month", date.y);
            }
          }
        })
          .stream();
      workbook_name = `ChildrenScreening ${Date.now()}`;
      workSheet_name = `Children Screening`;
      var res = ''
      excelStream(res, stream, workbook_name, workSheet_name, givendir);
      }
    })
  }


}