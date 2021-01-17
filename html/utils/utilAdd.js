const knex = require('../../mainfunc/db');
const nscAdmissionLogic = (elMuac, elCom1, elQuantity1, elhistory, elCinical_examination, elAddType, elRefType, elAge, elUc, elVillage, ddHH, ddThesil) => {
    /**
     * no muac rule
     * disable clinical condition
     * default rutf to nothing
     * disableplw
     * add Types
     * disable uc and village
     */
    $("#"+elUc).val('');
    $("#"+ddThesil).val('');
    $("#"+elUc).attr("disabled", true);
    $("#"+elVillage).attr('disabled', true);
    $('#'+elAge).attr('min',0)
    $('#'+elAge).attr('max',59)
    $('#'+elMuac).attr('max', 25);
    $('#'+elhistory).hide()
    $('#'+elCinical_examination).hide()
    $('#'+elCom1).val('');
    $('#'+elQuantity1).val(0);
    $('#plw_type').attr('disabled', true)
    $("#"+elAddType).children('option:not(:first)').remove();
    $("#"+elAddType).append(`
    <option value="new_add">New Admission</option>
    <option value="transfer_from_ward"> Transfer from ward</option>
    <option value="transfer_in_from_otp"> Transfer In From OTP </option>
    <option value="return_after_lama"> Return after LAMA</option> 
    <option value="relapse">Relapse after cured</option>
    <option value="other">Other</option>
        `);
    $("#"+elRefType)
        .children("option:not(:first)")
        .remove();
    $("#"+elRefType).append(`
    <option value="ref_by_otp">OTP</option>
    <option value="opd">OPD</option>
    <option value="ward">Ward</option>
    <option value="other">Other</option>`);
    $("#" + ddHH).children('option:not(:first)').remove();    


}
const otpAdmissionLogic= (elMuac, elOedema,elhistory, elClinical_examination,elAddType,elRefType,elAge,elUc, elVillage)=>{
    /**
     * muac rule
     * admision type muac rule
     * MOVED IN, BY SC CARE NO
     *  NO MUAC RESTRICTION
     * oedema base rule
     * default rutf
     * disable plw
     * add Types
     * enable uc and village
     */
    $("#"+elUc).attr("disabled", false);
    $("#"+elUc).val('');
    $("#"+elVillage).attr('disabled', false);
    $("#"+elVillage).val('');
    $('#'+elAge).attr('min',0)
    $('#'+elAge).attr('max',59)
    $('#plw_type').attr('disabled', true)
    $('#'+elhistory).show()
    $('#' + elClinical_examination).show()
    // $('#' + elMuac).attr('min', 25);
    $('#' + elMuac).attr('max', 11.4);
    $("#"+elAddType).children('option:not(:first)').remove();
    $("#"+elAddType).append(`
        <option value="no_prv_pro">New Admission</option>
        <option value="relapse">Relapse</option>
        <option value="return_def">Return After Defaulter</option>
        <option value="in-patient_refusal">In-patient Refusal</option>
        <option value="transfer_in_from_nsc">Transfer in from NSC</option>
        <option value="tranfer_in_other_otp">Transfer in<small>From other OTP</small></option>
        <option value="tranfer_in_from_sfp">Transfer in<small>From TSFP</small></option>
        <option value="moved_in">Moved In</option>
        <option value="other">Other</option>
        `);
    $("#"+elRefType)
        .children("option:not(:first)")
        .remove();
    $("#"+elRefType).append(`
      <option value="self">Self</option>
      <option value="peer">Peer to Peer</option>
      <option value="chw">CHW</option>
      <option value="lhw">LHW</option>
      <option value="doh_staff">DOH Staff</option>
      <option value="com_org">Community Org</option>
      <option value="by_sc_care">By SC Care</option>
      <option value="by_otp">By OTP</option>
      <option value="from_opd">From OPD</option>
      <option value="by_tsfp">By TSFP</option>
      <option value="other">Other</option>`);
      $('#'+elOedema).val('absent');
}

const changeMuacOnOdema = (elOdemaVal, elMuac, progType, addType)=>{
    if (progType === 'otp') {
        (elOdemaVal !== 'absent' || addType == 'moved_in' || addType == 'transfer_in_from_nsc' ) ? $('#'+elMuac).attr('max',25) : $('#'+elMuac).attr('max',11.4)
    } else {
        $('#'+elMuac).attr('max',25)
    }
}

const hhOnProgType = async (progType, elHH, elTehsil, elUC) => {
    var _elHH = $('#' + elHH);
    var tehsil_id = $('#'+elTehsil)
    if (progType = sc) {
        try {
            var x_ = await knex('geo_active').select('site_id', 'site_name').where({ tehsil_id, sc: 1 })
            $("#" + ddHH).children('option:not(:first)').remove();  
            for (x of x_) {
                $("#" + ddHH).append(`<option val="${x.site_id}">${x.site_name}</option>`)
            }
        } catch (error) {
            console.log(error)
        }
       
    } 
}

module.exports = {
    nscAdmissionLogic,
    otpAdmissionLogic,
    changeMuacOnOdema,
    hhOnProgType
}