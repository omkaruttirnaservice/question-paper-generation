var connetion_info = require("../../ip_data");
var host = connetion_info.ip_adress.host;
var CURL_link = {
  new_exam_list: host + "getNewExamList",
  download_exam: host + "DownloadExam",
  download_student_batch: host + "DownloadStudentBatch",
  upload_exam_link: host + "saveUploadedExam",
  get_center_data: host + "getCenterData",
};
exports.CURL_link = CURL_link;
