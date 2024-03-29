const knex = require('../mainfunc/db');


module.exports.initOtpFollowUpEdit = function () {
  function DecimalField(config) {
    jsGrid.fields.number.call(this, config);
  }

  DecimalField.prototype = new jsGrid.fields.number({

    filterValue: function () {
      return this.filterControl.val() ?
        parseFloat(this.filterControl.val() || 0, 10) :
        undefined;
    },

    insertValue: function () {
      return this.insertControl.val() ?
        parseFloat(this.insertControl.val() || 0, 10) :
        undefined;
    },

    editValue: function () {
      return this.editControl.val() ?
        parseFloat(this.editControl.val() || 0, 10) :
        undefined;
    }
  });

  jsGrid.fields.decimal = jsGrid.DecimalField = DecimalField;

  // $(function () {
  //   var datePickerId = document.getElementById('followup_date');
  //   datePickerId.max = new Date().toISOString().split("T")[0];
  // });

  $(function () {
    ipc.send('getProvince');
    ipc.on('province', function (evt, province) {
      $('#ddProvince').children('option:not(:first)').remove();

      // province.province.forEach(el=>{
      // $('#ddProvince').append(`<option value="${el.id}">${el.provinceName}</option>`);

      // })
      prov(province);
    })
    $('#ddProvince').on('change', function () {
      var prov = $(this).val();
      ipc.send('getDistrict', prov)
      ipc.on('district', function (evt, district) {
        $('#ddDistrict').children('option:not(:first)').remove();

        //   district.district.forEach(el=>{
        // $('#ddDistrict').append(`<option value="${el.id}">${el.districtName}</option>`);              
        //   })
        dist(district);
      })
    })
    $('#ddDistrict').on('change', function () {
      var dist = $(this).val();
      ipc.send('getTehsil', dist)
      ipc.on('tehsil', function (evt, tehsil) {
        $('#ddTehsil').children('option:not(:first)').remove();

        //   tehsil.tehsil.forEach(el=>{
        // $('#ddTehsil').append(`<option value="${el.id}">${el.tehsilName}</option>`);              
        //   })
        teh(tehsil);
      })
    })
    $('#ddTehsil').on('change', function () {
      var tehs = $(this).val();
      ipc.send('getUC', tehs)
      ipc.on('uc', function (evt, uc) {
        $('#ddUC').children('option:not(:first)').remove();

        //   uc.uc.forEach(el=>{
        // $('#ddUC').append(`<option value="${el.id}">${el.ucName}</option>`);              
        //   })
        ucListener(uc);
      })
    })
    var ucForHH;
    $('#ddUC').on('change', function () {
      var ucs = $(this).val();
      ucForHH = ucs
      ipc.send('getHealthHouse', ucs)
      ipc.on('hh', function (evt, hh) {
        $('#ddHealthHouse').children('option:not(:first)').remove();
        //   hh.hh.forEach(el=>{
        // $('#ddHealthHouse').append(`<option value="${el.id}">${el.siteName}</option>`);              
        //   })
        hhListener(hh);
      })
    })
    $('#ddHealthHouse').on('change', function () {
      // var ucs = $('#ddUC').val();
      var h_id = $(this).val();
      ipc.send('getHealthHouseType', h_id)
      ipc.on('hhType', function (evt, hh) {

        hhTypeListener(h_id, hh);

      })
    })
  })
  $('#ddHealthHouse').on('change', function () {
    // var ucs = $('#ddUC').val();
    var h_id = $(this).val();
    ipc.send("getVillage", h_id);
    ipc.on("haveVillage", (evt, _villages) => {
      $("#ddVillageName")
        .children("option:not(:first)")
        .remove();
      villListener(_villages);

    });
  });



  let _com = async () => {
    var x = await knex('tblCommodity').select('item_name', 'id').where({
      prog_type: 'otp'
    })
    // console.log(x)
    return x;
  }
  let _followup = async (data) => {
    try {
      var x = await knex('v_otpFollowupUpdate').where({
        is_deleted: 0,
        // upload_status:2
      }).where({
        site_id: data.site_id,
        reg_id: data.reg_id
      }).where('site_village', 'like', `%${data.site_village}%`)
      console.log(x)
      return x;
    } catch (error) {
      console.log(error)
      return error
    }

  }
  let _delFollowUp = async (id) => {
    var x = await knex('tblOtpFollowup').where({
      followup_id: id
    }).update({
      is_deleted: 1,
      upload_status:2
    })
    return ''
  }
  let _editFollowUp = async (item) => {
    // console.log(item)
    delete item.site_village;
    delete item.reg_id;
    delete item.p_name;
    delete item.f_or_h_name;
    delete item.province_id
    delete item.district_id
    delete item.tehsil_id
    delete item.uc_id
    delete item.site_id
    item.upload_status = 2;
    var date_ = new Date(item.next_followup)
    date_.setDate(date_.getDate() + 1);
    // date_.toISOString();
    // date_.toJSON().split('T')[0];
    date_ = date_.toJSON().split('T')[0]
    item.next_followup = date_;
    
    var lastFollowup = await knex('tblOtpFollowup').where({ otp_id: item.otp_id }).orderBy('followup_id', 'desc').limit(1).where({ is_deleted: 0 });
    console.log({lastFollowup})
    if (lastFollowup[0].followup_id == item.followup_id) {
      var lastInterm = await knex('tblInterimOtp').select('interim_id').where({ otp_id: item.otp_id, is_deleted: 0 }).limit(1).orderBy('interim_id', 'desc');
      var updInterm = {};
      // console.log({lastInterm})
      // delete _lastInterm.interim_id;
      updInterm.muac = item.muac
      updInterm.weight = item.weight
      updInterm.ration1 = item.ration1
      updInterm.ration2 = item.ration2
      updInterm.ration3 = item.ration3
      updInterm.quantity1 = item.quantity1
      updInterm.quantity2 = item.quantity2
      updInterm.quantity3 = item.quantity3
      updInterm.other_com_name = item.other_com_name
      updInterm.other_com_qty = item.other_com_qty
      try {
        await knex('tblInterimOtp').update(updInterm).where({ interim_id: lastInterm[0]['interim_id'] })
        
      } catch (error) {
        console.log(error)
      }
    }
    var x = await knex('tblOtpFollowup').update(item).where({
      followup_id: item.followup_id
    })
    console.log({
      x
    });
    var y = await knex('v_otpFollowupUpdate').where({
      followup_id: item.followup_id
    })
    console.log({
      y
    })
    return y[0];

  }

  let _grid = async (id) => {
    var commodities = await _com();
    console.log(id)
    $("#jsGrid").jsGrid({
      height: "500px",
      width: "100%",
      // filtering: true,
      // inserting: true,
      editing: true,
      // sorting: true,
      // paging: true,
      autoload: true,
      pageLoading: false, // this is the clue
      pageSize: 10,
      pageButtonCount: 5,
      deleteConfirm: "Do you really want to delete client?",
      controller: {
        loadData: async (filter) => {
          console.log(id);
          return await _followup(id);
        },
        updateItem: async (item) => {
          console.log(item)
          // console.log("update");
          // item.followup_date = $('#followup_date').val();
          // console.log(item);
          return await _editFollowUp(item);
        },
        deleteItem: async (item) => {
          followup_id = item.followup_id
          return await _delFollowUp(followup_id);
        }
      },
      fields: [
        // {
        //   name: "otp_id",
        //   title: "ID",
        //   type: "number",
        //   width: 30,
        //   editing: false
        // },
        {
          name: "reg_id",
          title: "Reg #",
          type: "text",
          width: 50,
          editing: false
        },
        {
          name: "p_name",
          title: "Name",
          type: "text",
          width: 100,
          editing: false
        },
        {
          name: "f_or_h_name",
          title: "Father/Husb: Name",
          type: "text",
          width: 100,
          editing: false
        },
        {
          name: "site_village",
          title: "Village",
          type: "text",
          width: 100,
          editing: false
        },
        {
          name: "weight",
          title: "Weight",
          type: "decimal",
          width: 50,
          editing: true,
          validate: "required"
        },
        {
          name: "muac",
          title: "MUAC",
          type: "decimal",
          width: 50,
          editing: true,
          validate: "required"
        },
        {
          name: "ration1",
          title: "Ration-1",
          type: "select",
          items: commodities,
          valueField: "item_name",
          textField: "item_name",
          width: 80,
          validate: "required"
        },
        {
          name: "quantity1",
          title: "Qty-1",
          type: "number",
          width: 40,
          validate: {
            validator: "min",
            param: 0
          }
        },
        {
          name: "ration2",
          title: "Ration-2",
          type: "select",
          items: commodities,
          valueField: "item_name",
          textField: "item_name",
          width: 80
        },
        {
          name: "quantity2",
          title: "Qty-2",
          type: "number",
          width: 40
        },
        {
          name: "ration3",
          title: "Ration-3",
          type: "select",
          items: commodities,
          valueField: "item_name",
          textField: "item_name",
          width: 80
        },
        {
          name: "quantity3",
          title: "Qty-3",
          type: "number",
          width: 50
        },
        {
          name: "other_com_name",
          title: "Other Com: Name",
          type: "text",
          width: 50
        },
        {
          name: "other_com_qty",
          title: "Other Com: Qty",
          type: "number",
          width: 50
        },
        {
          width: 80,
          align: 'center',
          headerTemplate: function () {
            return "<th class='jsgrid-header-cell'>Last Followup in days</th>";
          },
          itemTemplate: function (value, item) {
            console.log(item)
            var date1 = new Date(item.curr_date);
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            // alert(diffDays);
            return diffDays;
          }
        },
        {
          name: "next_followup",
          type: "date",
          title: "Next Follow Up",
          // editing: false,
          align: "right"
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
          editing: false,
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
          deleteButton: true,
          eidtButton: true
        }
      ],
      rowClass: function (item, itemIndex) {
        var date1 = new Date(item.curr_date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log(diffDays)
        return diffDays > 21 ? 'bg-red' : '';
        // itemIndex%2==0 ? 'bg-red' : 'bg-green';
      },
      rowClick: async function (args) {
        var date1 = new Date(args.item.upload_date);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        diffDays = (args.item.upload_status == 1) ? diffDays : 0;
        var _allowedDays = parseInt(window.sessionStorage.getItem('AllowedDays'));
      if (diffDays < _allowedDays) {
          var exit_check = await knex('tblOtpExit').where({
            otp_id: args.item.otp_id,
            is_deleted: 0
          })
          if (exit_check.length > 0) {
            alert('This could not be edited b/c patient is already exited')

          } else {

            this.editItem(args.item);
          }
        } else {
          alert('This could not be edited b/c its been more than 5 days since uploaded')

        }
      }
    });
  }

  $('#editFollowupForm').on('submit', async function (e) {
    e.preventDefault();
    $(this).validate();
    if ($(this).valid()) {
      var formData = $(this).serializeFormJSON();
      console.log(formData)
      await _grid(formData);
    }

    var id = $('#reg_id').val();

    if (id == '') {
      alert('Registration id is required')
    } else {}

  })
  $(document).ready(function () {
    $('#FollowupEditListExport').click(async function () {
      try {
        var data = $("#jsGrid").jsGrid("option", "data");
        
        // var data = $('#txt').val();
        if (data == '') {
          alert('No data to export')
          return;
        }
        JSONToCSVConvertor(data, "Exit Edit List", true);

      } catch (error) {
        console.log(error)
        alert('Data Fetch error')
      }


      // JSONToCSVConvertor(data, "Vehicle Report", true);
    });
  });

}