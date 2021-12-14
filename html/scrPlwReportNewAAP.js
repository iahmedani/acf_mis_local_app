const knex = require('../mainfunc/db');
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

module.exports.initScrPlwNewReport = function () {

  $(function () {
    // var datePickerId_end = document.getElementById('end_date');
    // datePickerId_end.max = new Date().toISOString().split("T")[0];
    var datePickerId_start = document.getElementById('start_date');
    datePickerId_start.min = new Date(2018, 07, 01).toISOString().split("T")[0];

    // $('#ddInterval').on('change', function () {
    //   var value = $(this).val();
    //   // console.log(value);
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
      // ipc.send('getHealthHouse', ucs)
      // ipc.on('hh', function (evt, hh) {
      //   $('#ddHealthHouse').children('option:not(:first)').remove();
      //   hhListener(hh);
      // })
    })
  });

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

  
  $(function () {
    function putSummaryDataToTableAAP(table, array) {
      $(`#${table} td`).each(function () {
        $(this).empty();
      })
      console.log(array)
      var keys = Object.keys(array[0]);
      var totals = {};
      keys.forEach(el => {
        array.forEach(_el =>{
          var __x_ = el.replace('pragnent', '').replace('lactating2', '').replace('lactating', '');
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
    function scrChildReport(qry) {
      return new Promise((resolve, reject) => {
        ipc.send('scrPlwNewReport', (qry));
        ipc.on('scrPlwNewReport', (e, result) => {
          if (result.err) {
            reject(result.err)
            ipc.removeAllListeners('scrPlwNewReport')
          } else {
            resolve(result.result);
            ipc.removeAllListeners('scrPlwNewReport')

          }
        })
      })
    }
    $('#showDataScrPlwReport').on('click', function (e) {
      e.preventDefault();
      console.log([$('#start_date').val(), $('#end_date').val()])
      if ($('#filterDate').valid()) {
        scrChildReport(prepareQry())
          .then(result => {
            // console.log({result})
            putSummaryDataToTableAAP('scrPlwNewSum', result.summary)
            // singleDataTable(result.single)
            // createSingleEntryTable('scrPlwNewSingle', result.single, fullTextPlw, colNamePlw)

          })
          .catch(e => {
            console.log('error occured during summary table creation')
          })
      }
    });
  })
  
  $('#exportSummaryPlw').on('click', function () {
    export_xlsx();
  })
  /* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
  /*global Uint8Array, console */
  /* exported export_xlsx */
  /* eslint no-use-before-define:0 */
  var XLSX = require('xlsx');
  var electron = require('electron').remote;

  var export_xlsx = (function () {
    // var HTMLOUT = document.getElementById('htmlout');
    var XTENSION = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|")
    return function () {
      var workbook = XLSX.utils.book_new();
      var ws1 = XLSX.utils.table_to_sheet(document.getElementById('scrPlwNewSum'));
      XLSX.utils.book_append_sheet(workbook, ws1, "Summary");

      var o = electron.dialog.showSaveDialog({
        title: 'Save file as',
        filters: [{
          name: "Spreadsheets",
          extensions: XTENSION
        }]
      });
      // console.log(o);
      XLSX.writeFile(workbook, o);
      electron.dialog.showMessageBox({
        message: "Exported data to " + o,
        buttons: ["OK"]
      });
    };
  })();
  void export_xlsx;

  var exportDetailPlw = $('#exportDetailPlw')

  exportDetailPlw.on('click',  function () {
        var qry = prepareQry();
        myNewExport(qry)
    
  })

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
      console.log(chunk)
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
    console.log(qry);
    return qry;
  }
  function myNewExport(cond) {
    //  console.log(cond)
    electron.dialog.showOpenDialog({
      title: 'Please select folder to save detail report',
      properties:['openDirectory']
    }, (givendir) => {
      if (!givendir) {
       alert('Export failed:  Operation was canceled')
      } else {
        var stream = knex("scrplwreportv4")
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
        // console.log(stream)
      workbook_name = `PLWScreening ${Date.now()}`;
      workSheet_name = `PLW Screening`;
      var res = ''
      excelStream(res, stream, workbook_name, workSheet_name, givendir);
      }
    })
  }


}