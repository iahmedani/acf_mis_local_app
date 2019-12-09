module.exports.stockDist = function () {
  // $(function () {
  //   var datePickerId = document.getElementById('txtScrChildDate');
  //   datePickerId.max = new Date().toISOString().split("T")[0];
  // });
  // var _lastEntryGeoFound = window.sessionStorage.getItem('lastDistGeo');
  // if(_lastEntryGeoFound){
  //   console.log({_lastEntryGeoFound})
  //   _lastEntryGeoFound = JSON.parse(_lastEntryGeoFound);
  //   console.log({_lastEntryGeoFound})
  //   $('#distMonth').val(_lastEntryGeoFound.report_month.val).change();
  //   // $('#ddProgramType').children('option:not(:first)').remove();
  //   // $('#ddProgramType').append(`<option value="${_lastEntryGeoFound.prog_type.val}">${_lastEntryGeoFound.prog_type.text} </option>`)
  //   $(`#ddProgramType`).val(_lastEntryGeoFound.prog_type.val)
  //   $(`#ddProgramType`).change();
  //   $('#ddDistrict').children('option:not(:first)').remove();
  //   $('#ddDistrict').append(`<option value="${_lastEntryGeoFound.district.val}">${_lastEntryGeoFound.district.text} </option>`)
  //   $(`#ddDistrict`).val(_lastEntryGeoFound.district.val).change();
  //   $('#ddTehsil').children('option:not(:first)').remove();
  //   $('#ddTehsil').append(`<option value="${_lastEntryGeoFound.tehsil.val}">${_lastEntryGeoFound.tehsil.text} </option>`)
  //   $(`#ddTehsil`).val(_lastEntryGeoFound.tehsil.val).change();
  //   $('#ddUC').children('option:not(:first)').remove();
  //   $('#ddUC').append(`<option value="${_lastEntryGeoFound.uc.val}">${_lastEntryGeoFound.uc.text} </option>`)
  //   $(`#ddUC`).val(_lastEntryGeoFound.uc.val).change();
  //   $('#ddHealthHouse').children('option:not(:first)').remove();
  //   $('#ddHealthHouse').append(`<option value="${_lastEntryGeoFound.site.val}">${_lastEntryGeoFound.site.text} </option>`)
  //   $(`#ddHealthHouse`).val(_lastEntryGeoFound.site.val).change();
  //   $('#ddStaff_code').children('option:not(:first)').remove();
  //   $('#ddStaff_code').append(`<option value="${_lastEntryGeoFound.staff_code.val}">${_lastEntryGeoFound.staff_code.text} </option>`)
  //   $(`#ddStaff_code`).val(_lastEntryGeoFound.staff_code.val).change();
  //   $('#ddStaff_name').children('option:not(:first)').remove();
  //   $('#ddStaff_name').append(`<option value="${_lastEntryGeoFound.staff_name.val}">${_lastEntryGeoFound.staff_name.text} </option>`)
  //   $(`#ddStaff_name`).val(_lastEntryGeoFound.staff_name.val).change();
  //   $('#ddSup_name').children('option:not(:first)').remove();
  //   $('#ddSup_name').append(`<option value="${_lastEntryGeoFound.sup_name.val}">${_lastEntryGeoFound.sup_name.text} </option>`)
  //   $(`#ddSup_name`).val(_lastEntryGeoFound.sup_name.val).change();
  //   $('#ddSup_code').children('option:not(:first)').remove();
  //   $('#ddSup_code').append(`<option value="${_lastEntryGeoFound.sup_code.val}">${_lastEntryGeoFound.sup_code.text} </option>`)
  //   $(`#ddSup_code`).val(_lastEntryGeoFound.sup_code.val).change();
  // }

  $('#ddProgramType').change(()=>{
    $('.prgChange').val("")
  })
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
    $('#ddTehsil').on('change', function () {
      var tehs = $(this).val();
      ipc.send('getUC', tehs)
      ipc.on('uc', function (evt, uc) {
        $('#ddUC').children('option:not(:first)').remove();
        ucListener(uc);
      })
    })
    var ucForHH;
    $('#ddUC').on('change', function(){
      var ucs = $(this).val();
      ucForHH = ucs
      ipc.send('getHealthHouse', ucs )
      ipc.on('hh', async function(evt, hh){
        // console.log(hh)
        $('#site_one').children('option:not(:first)').remove();
        if(hh.hh.length > 1){
          $('.secondSite').css('display', '')  
          $('#site_two').children('option:not(:first)').remove();
          await asyncForEach(hh.hh, async(el)=>{
            $('#site_two').append(`<option value="${el.siteName}">${el.siteName}</option>`);              
          })            
        }else{
          $('.secondSite').css('display', 'none')  

        }
        hhListener_siteOne(hh);

      });
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
    $('#ddUC').on('change', function () {
      var ucs = $(this).val();
      ucForHH = ucs
      if($('#ddProgramType').val() == 'otp'){
        ipc.send('getHealthHouse', ucs)
        ipc.on('hh', function (evt, hh) {
          $('#ddHealthHouse').children('option:not(:first)').remove();
          hhListener(hh);
        })

      }
    })
    // $('#ddUC').on('change', function () {
    //   var ucs = $(this).val();
    //   ucForHH = ucs
    //   ipc.send('getHealthHouse', ucs)
    //   ipc.on('hh', function (evt, hh) {
    //     $('#ddHealthHouse').children('option:not(:first)').remove();
    //     hhListener(hh);
    //   })
    // })
    $("#ddHealthHouse").on("change", function () {
      var siteId = $(this).val();
      // ucForHH = ucs;
      ipc.send("getStaff", siteId);
      ipc.send("getSups", siteId);

      ipc.on("haveStaff", function (evt, staffs) {
        $("#ddStaff_code")
          .children("option:not(:first)")
          .remove();
        staffListener(staffs);
      });
      ipc.on("haveSups", function (evt, _sups) {
        $("#ddSup_code")
          .children("option:not(:first)")
          .remove();
        supListener(_sups);
      });
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
  })
  // $('#submitScrChildForm').on('click', (e) => {
  //   // console.log(data);
  //   $('#scrChildrenForm').validate();
  //   if ($('#scrChildrenForm').valid()) {
  //     var scrChildrenData = $('#scrChildrenForm').serializeFormJSON();
  //     console.log(scrChildrenData);
  //     ipc.send('scrChildren', scrChildrenData);
  //     ipc.removeAllListeners('scrChildren');
  //     // $('#scrChildrenForm').get(0).reset();
  //     $('.clr').val("");
  //     $('.cld').val("");
  //     $('input[type="number"]').attr('min', 0);
  //   }
  //   e.preventDefault();
  // })
  // $('#resetScrChildForm').on('click', () => {
  //   $('#scrChildrenForm').get(0).reset();
  // });
  $(() => {
    // $('.outreach').hide();
    $('#ddProgramType').on('change', function () {
      var val = $(this).val();
      // if (data.length > 0) {
        //   data = [];
        // }
        console.log(val)
        if (val == 'outreach') {
          $('.outreach').show();
          $('.outreach input').attr('required', true);
          $('.nsc').show();
          $('.noOutreach').hide();
          $('.nsc input').attr('required', true);
        } else if (val == 'sc') {
          $('.nsc').hide();
          $('.nsc input').attr('required', false);
          $('.outreach').hide();
          $('.outreach input').attr('required', false);
        } else {
          $('.outreach').hide();
          $('.nsc').show();
          $('.nsc input').attr('required', true);
          $('.outreach input').attr('required', false);
          
        }
      })
    })
    var data = [];
  let myInsert = (item) => {
    console.log(item);
    return new Promise((resolve, reject) => {
      //  Description = [{ Name: '', item: '' }];
      //  Unit = [{ Name: '', item: '' }];
      //  SubUnit = [{ Name: '', item: '' }];
      var length = data.length + 1;
      item.id = data.length + 1;
      item.prog_type = $("#ddProgramType").val();
      // item.stock_release_date = $("#stock_release_date").val();
      item.remaining = (item.opening + item.received) - (item.distributed + item.damaged)
      item.district_id = $("#ddDistrict").val();
      item.province_id = $("#ddProvince").val();
      item.tehsil_id = $("#ddTehsil").val();
      item.uc_id = $("#ddUC").val() || 0;
      item.site_id = $("#ddHealthHouse").val() || 0;
      item.CHW_id = $("#ddStaff_code").val() || 0;
      item.CHS_id = $("#ddSup_code").val() || 0;
      item.upload_status = 0;
      item.created_at = new Date().toLocaleDateString();
      item.dist_month = $("#distMonth").val();
      $("#stockDist").validate();
      if (data.filter(el => el.item_name == item.item_name).length > 0) {
        alert('Same item is not allowed to enter multiple time, if you want to change quantity release please click to edit the line/same item');
      } else {

        if ($("#stockDist").valid()) {
          data.push(item);
          // console.log(data);
        }
      }

      // data.push(item);
      // console.log(data);
      if (length == data.length && $("#stockDist").valid()) {
        resolve(data[data.length]);
      } else {
        reject();
      }
    })
  }
  let delItem = (item) => {
    return new Promise((resolve, reject) => {
      var total = data.length
      data = data.filter(function (single) {
        return single !== item
      })
      console.log(data);

      if (data.length != total) {
        // data.splice(index, 1);
        resolve(data)
      } else {
        reject()
      }
    })
  }
  let updItem = (item) => {
    return new Promise((resolve, reject) => {
      var tempVar = false;
      data.forEach((el, i) => {
        if (el.id == item.id) {
          // console.log('item matched in update')
          data[i] = item;
          tempVar = true
        }
      })

      if (tempVar) {
        // delIndex.splice(index, 1);
        // console.log(data);
        resolve(item)
      } else {
        reject()
      }
    })
  }
  $(() => {
    var sendValue = function (varName, value) {
      // console.log(varName, value)
      var xx = varName.filter(el => el.item == value)
      // console.log(xx)
      // if (value == '') {
      //   return { Name: "", item: "" };
      // } else{}
      return xx;
    }
    $("#ddProgramType").on('change', function () {
      var progType = $(this).val();
      ipc.send('getCommodity', progType);
      ipc.on('commodity', (evt, com) => {
        var Description = [{ Name: '', item: '' }];
        var Unit = [{ Name: '', item: '' }];
        var SubUnit = [{ Name: '', item: '' }];
        var items = [{ Name: "" }];
        var item_id = [{ Name: '', item: '' }];
        // console.log(com)
        // var availStock = [{ Name: "", item: '' }];
        com.commodity.forEach((el, i) => {
          Description.push({
            Name: el.item_desc,
            item: el.item_name,
          })
          Unit.push({
            Name: el.item_unit,
            item: el.item_name,
          })
          SubUnit.push({
            Name: el.item_sub_unit,
            item: el.item_name,
          })
          items.push({
            Name: el.item_name,
            item: el.item_name,
          })
          item_id.push({
            Name: el.id,
            item: el.item_name,
          })
          // availStock.push({
          //   Name: el.remaining,
          //   item: el.item_name,
          // })
          if (com.commodity.length - 1 == i) {
            stockGrid(Description, Unit, items, SubUnit, item_id);
          }
        })
      })

      function stockGrid(Description, Unit, items, SubUnit, item_id) {
        $("#stockDistGrid").jsGrid({
          width: "100%",
          height: "400px",
          inserting: true,
          editing: true,
          sorting: true,
          paging: true,
          controller: {
            loadData: filter => {
              return data;
            },
            insertItem: item => {
              return myInsert(item);
            },
            updateItem: function(item) {
              // console.log('updateitem clicked', item)
              return updItem(item);
            },

            deleteItem: function(item) {
              return delItem(item);
            }
          },

          fields: [
            // {name:'country_code', title:'Country Code', type:'text'},
            // {name:'base_code', title:'Base Code', type:'text'},
            // {name:'dept_code', title:'Dept Code', type:'text'},
            // {name:'proc_req', title:'Proc: Req: #', type:'text'},
            // {name:'proc_line', title:'Proc: Line', type:'text'},
            {
              name: "item_name",
              title: "Item",
              type: "select",
              items: items,
              valueField: "Name",
              textField: "Name",
              valueType: "string",
              insertTemplate: function() {
                var descField = this._grid.fields[1];
                var unitField = this._grid.fields[2];
                var subUnitField = this._grid.fields[3];
                var item_idField = this._grid.fields[9];
                console.log(item_idField);
                // var avalable_stockField = this._grid.fields[4];
                // var quantity_releasedField = this._grid.fields[5];
                // var testField = this._grid.fields[6];
                var $inertControl = jsGrid.fields.select.prototype.insertTemplate.call(
                  this
                );
                $inertControl.on("change", function() {
                  var itemId = $(this).val();
                  descField.items = sendValue(Description, itemId);
                  $(".item_desc-insert")
                    .empty()
                    .append(descField.insertTemplate());
                  unitField.items = sendValue(Unit, itemId);
                  $(".disp_unit-insert")
                    .empty()
                    .append(unitField.insertTemplate());
                  subUnitField.items = sendValue(SubUnit, itemId);
                  $(".disp_sub_unit-insert")
                    .empty()
                    .append(subUnitField.insertTemplate());
                  item_idField.items = sendValue(item_id, itemId);
                  $(".item_id-insert")
                    .empty()
                    .append(item_idField.insertTemplate());
                  // avalable_stockField.items = sendValue(availStock, itemId);
                  // $(".avalable_stock-insert").empty().append(avalable_stockField.insertTemplate());
                  // testField = (avalable_stockField - quantity_releasedField);
                  // $(".test-insert").empty().append(testField.insertTemplate());
                });
                return $inertControl;
              },
              editTemplate: function(value) {
                var descField = this._grid.fields[1];
                var unitField = this._grid.fields[2];
                var subUnitField = this._grid.fields[3];
                var item_idField = this._grid.fields[9];
                // console.log(item_idField);

                // var avalable_stockField = this._grid.fields[4];
                // var quantity_releasedField = this._grid.fields[5];
                // var testField = this._grid.fields[6];
                var $editControl = jsGrid.fields.select.prototype.editTemplate.call(
                  this,
                  value
                );

                var changeItem = function() {
                  var editVal = $editControl.val();
                  // console.log({editVal: editVal})
                  descField.items = sendValue(Description, editVal);
                  $(".item_desc-update")
                    .empty()
                    .append(descField.editTemplate());
                  unitField.items = sendValue(Unit, editVal);
                  $(".disp_unit-update")
                    .empty()
                    .append(unitField.editTemplate());
                  subUnitField.items = sendValue(SubUnit, editVal);
                  $(".disp_sub_unit-update")
                    .empty()
                    .append(subUnitField.editTemplate());
                  item_idField.items = sendValue(item_id, editVal);
                  $(".item_id-update")
                    .empty()
                    .append(item_idField.editTemplate());
                  // avalable_stockField.items = sendValue(availStock, editVal);
                  // $(".avalable_stock-update").empty().append(avalable_stockField.editTemplate());
                  // testField = (availStock - quantity_releasedField);
                  // $(".test-update").empty().append(testField.editTemplate());
                };
                $editControl.on("change", changeItem);
                changeItem();
                return $editControl;
              }
            },
            {
              name: "item_desc",
              title: "Description",
              type: "select",
              items: Description,
              valueField: "Name",
              valueType: "string",
              textField: "Name",
              insertcss: "item_desc-insert",
              updatecss: "item_desc-update",
              itemTemplate: function(item_desc) {
                return item_desc;
              },
              readOnly: true
            },
            {
              name: "disp_unit",
              title: "Unit",
              type: "select",
              items: Unit,
              valueField: "Name",
              valueType: "string",
              textField: "Name",
              insertcss: "disp_unit-insert",
              updatecss: "disp_unit-update",
              itemTemplate: function(disp_unit) {
                return disp_unit;
              },
              readOnly: true
            },
            {
              name: "disp_sub_unit",
              title: "Sub Unit",
              type: "select",
              items: SubUnit,
              valueField: "Name",
              valueType: "string",
              textField: "Name",
              insertcss: "disp_sub_unit-insert",
              updatecss: "disp_sub_unit-update",
              itemTemplate: function(disp_sub_unit) {
                return disp_sub_unit;
              },
              readOnly: true
            },
            {
              name: "opening",
              title: "Opening",
              type: "decimal",
              validate: ["required", { validator: "min", param: 0 }]
            },
            {
              name: "received",
              title: "Received",
              type: "decimal",
              validate: ["required", { validator: "min", param: 0 }]
            },
            {
              name: "distributed",
              title: "Distributed",
              type: "decimal",
              validate: [
                "required",
                {
                  validator: function(value, item) {
                    return value <= item.opening + item.received;
                  },
                  message: function(value, item) {
                    return `${
                      item.item_name
                    } coult not be distribued more than available stock (opening + received) ${item.opening +
                      item.received}`;
                  }
                }
              ]
            },
            {
              name: "damaged",
              title: "Damaged",
              type: "decimal",
              validate: [
                "required",
                {
                  validator: function(value, item) {
                    return (
                      value <=
                      item.opening + item.received - item.distributed
                    );
                  },
                  message: function(value, item) {
                    return `${
                      item.item_name
                    } coult not be damaged more than available stock (opening + received - distributed) ${item.opening +
                      item.received -
                      item.distributed}`;
                  }
                }
              ]
            },
            {
              name:'stock_out',
              title:'Stock Out',
              width:80,
              align:'center',
              type:'decimal',
              validate:['required',{ validator: "min", param: 0 }]
            }, {
              name:'remarks_stock_out',
              title:'Reason for stock out',
              width:80,
              align:'center',
              type: "text"
              // validate:['required']
            },
            
            {
              name: "remaining",
              title: "Balance",
              width: 80,
              align: "center",
              type: "decimal",
              inserting:false,
              editing:false,
              filtering:false,
              // readOnly: true,
              itemTemplate: function(value, item) {
                // console.log(value)
                // var test = this._grid.fields[5];
                // var $inertControl = jsGrid.fields.decimal.prototype.insertTemplate.call(test);

                return ((parseFloat(item.opening) + parseFloat(item.received) ) - (parseFloat(item.distributed) + parseFloat(item.damaged) + parseFloat(item.stock_out)));
                // $inertControl.on("change", function() {
                // });
              }
            },
            {
              name: "item_id",
              title: "Id",
              type: "select",
              css: "d-none",
              items: item_id,
              valueField: "Name",
              valueType: "number",
              textField: "Name",
              insertcss: "item_id-insert",
              updatecss: "item_id-update",
              itemTemplate: function(item_id) {
                // console.log(item_id);
                return item_id;
              }
            },
            {
              type: "control",
              editButton: false,
              modeSwitchButton: false
            }
          ]
        });
      }   
    });
   

  });
  // $(function () {
  //   var datePickerId = document.getElementById('stock_release_date');
  //   datePickerId.max = new Date().toISOString().split("T")[0];
  // });
  $("#stockDistSubmit").on("click", e => {
    console.log(data);
    // if(data.length>0){

    var stockDistArr = [];
    data.forEach(el => {
      delete el.id;
      stockDistArr.push(el);
    });
    console.log(stockDistArr);
    // var _lastEntryGeo = {
    //   report_month:{
    //     val:$('#distMonth').val()
    //   },
    //   province:{
    //     val: $('#ddProvince').val(),
    //     text: $( "#ddProvince  option:selected" ).text(),
    //   },
    //   district:{
    //     val: $('#ddDistrict').val(),
    //     text: $( "#ddDistrict  option:selected" ).text(),
    //   },
    //   tehsil:{
    //     val: $('#ddTehsil').val(),
    //     text: $( "#ddTehsil  option:selected" ).text(),
    //   },
    //   uc:{
    //     val: $('#ddUC').val(),
    //     text: $( "#ddUC  option:selected" ).text(),
    //   },
    //   site:{
    //     val: $('#ddHealthHouse').val(),
    //     text: $( "#ddHealthHouse  option:selected" ).text(),
    //   },
    //   prog_type:{
    //     val: $('#ddProgramType').val(),
    //     text: $( "#ddProgramType  option:selected" ).text(),
    //   },
    //   sup_code:{
    //     val: $('#ddSup_code').val(),
    //     text: $( "#ddSup_code  option:selected" ).text(),
    //   },
    //   sup_name:{
    //     val: $('#ddSup_name').val(),
    //     text: $( "#ddSup_name  option:selected" ).text(),
    //   },
    //   staff_code:{
    //     val: $('#ddStaff_code').val(),
    //     text: $( "#ddStaff_code  option:selected" ).text(),
    //   },
    //   staff_name:{
    //     val: $('#ddStaff_name').val(),
    //     text: $( "#ddStaff_name  option:selected" ).text(),
    //   }
    // }

    // window.sessionStorage.setItem('lastDistGeo', JSON.stringify(_lastEntryGeo))
    ipc.send("stockDistEntry", stockDistArr);
    ipc.removeAllListeners("stockDistEntry");
    // data = [];
    // $('#jsGrid').jsGrid("loadData");
    // $('#scrPlwForm').get(0).reset();
    setTimeout(stockDistTemplate, 3000);

    // } else {
    //   $('#scrPlwForm').validate();
    // }
    e.preventDefault();
  });
  $("#stockDistReset").on("click", e => {
    data = [];
    // $('#jsGrid').jsGrid("loadData");
    $("#stockDist")
      .get(0)
      .reset();
    $("#stockDistGrid").jsGrid("destroy");
    e.preventDefault();
  });
}


