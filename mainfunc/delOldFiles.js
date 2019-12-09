let fs = require('fs')
module.exports = async (app)=>{
    // fs.stat(`${process.env.APPDATA}/nims_aap/oldFile.txt`, async function(err, stats){
    //     if(err){
    //         app.relaunch();
    //         app.exit();
    //         fs.unlinkSync(`${process.env.APPDATA}/nims_aap/acf_mis_local.sqlite3`)
    //         fs.unlinkSync(`${process.env.APPDATA}/nims_aap/config.json`)
    //         fs.writeFileSync(`${process.env.APPDATA}/nims_aap/oldFile.txt`, JSON.stringify(Date.now()), {encoding: 'utf8'});

    //     }else{
    //         console.log(stats)
    //     }
    // })

}