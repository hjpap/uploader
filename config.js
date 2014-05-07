/**
 * Created by wei.wang on 11/4/13.
 */
exports.config = {

    siteInfo:{
        siteURL:"http://localhost:3000",
        //siteStaticURL:"http://ricw.sinaapp.com/mestatic",
        siteStaticURL:"http://localhost:3000",
        title:"Me.",
        description:"Wei's Blog"
    },
    uploadDir:"./uploads",
    session_secret:"ricw",
    session_maxAge:30000,

    db: 'mongodb://localhost/uploader',
	//db: 'mongodb://wei.wang:vib1234567@localhost/MongoDB',

    articlePageSize:10

}
