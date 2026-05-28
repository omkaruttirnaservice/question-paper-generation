import db from "../config/db.connect.js";
// import aouth from '../schemas/aouth.js';
// import tm_publish_test_list from '../schemas/tm_publish_test_list.js';
export const DATES_LIST = "dates";
export const BATCH_LIST = "batchs";
export const POST_LIST = "posts";

const reportsModel = {
  getReportForType: async (type) => {
    let q;
    if (type === DATES_LIST) {
      q = `SELECT 
					DATE_FORMAT(sl_exam_date,'%d-%m-%Y') as sl_exam_date  
				FROM tn_student_list 
				GROUP BY sl_exam_date`;
      return await db.query(q);
    }

    if (type === BATCH_LIST) {
      q = `SELECT 
					sl_batch_no 
				FROM tn_student_list 
				GROUP BY sl_batch_no`;
      return await db.query(q);
    }

    if (type === POST_LIST) {
      q = `SELECT 
					sl_post
				FROM tn_student_list 
				GROUP BY sl_post`;
      return await db.query(q);
    }
  },

  getResultData: async (data) => {
    const RESULT_BY_BATCH = "Batch";
    const RESULT_BY_POST = "Post";
    let where = "";
    let q = "";
    const { postName, examDate, viewResultBy, type, page, limit, offset } =
      data;

    if (viewResultBy === RESULT_BY_POST) {
      where = ` WHERE sl_post = '${postName}' `;
    }

    if (viewResultBy === RESULT_BY_BATCH) {
      where = ` WHERE sl_post = '${postName}' AND DATE_FORMAT(sl_exam_date,'%d-%m-%Y') = '${examDate}' `;
    }

    if (type === "EXCEL") {
      q = `SELECT *,
					CONCAT(sl_f_name,' ',sl_m_name,' ',sl_l_name) AS full_name,
                    UPPER(sl_catagory) AS sl_catagory,
					DATE_FORMAT(sl_date_of_birth,'%d-%m-%Y') AS dob
					FROM tm_student_final_result_set AS sfrs
					INNER JOIN tn_student_list sl
					ON sfrs.sfrs_student_id = sl.id
					${where}
                    ORDER BY CAST(sfrs_marks_gain AS DECIMAL) DESC
					`;
    } else {
      q = `SELECT JSON_OBJECT(
					'pagination', JSON_OBJECT(
						'total_rows', t.total_rows,
						'page', ${page},
						'limit', ${limit},
						'total_pages', CEIL(t.total_rows / ${limit})
					),
					'candidate_results', JSON_ARRAYAGG(
						JSON_OBJECT(
							'id', sub.id,
							'full_name', CONCAT(sub.sl_f_name,' ',sub.sl_m_name,' ',sub.sl_l_name),
							'dob', DATE_FORMAT(sub.sl_date_of_birth,'%d-%m-%Y'),
                            'gender', sub.sl_gender,
							'post', sub.sl_post,
							'marks', sub.sfrs_marks_gain,
							'sfrs_student_roll_no', sub.sfrs_student_roll_no,
							'sfrs_unattempted', sub.sfrs_unattempted,
							'sfrs_wrong', sub.sfrs_wrong,
							'sfrs_correct', sub.sfrs_correct,
							'sfrc_total_marks', sub.sfrc_total_marks,
							'sfrs_marks_gain', sub.sfrs_marks_gain,
							'sfrs_student_id', sub.sfrs_student_id,
							'sfrs_publish_id',  sub.sfrs_publish_id,
							'srfs_percentile', sub.srfs_percentile
						)
					)
				) AS result_data
				FROM 
				(
					SELECT sfrs.*, sl.sl_f_name, sl.sl_m_name, sl.sl_l_name, sl.sl_date_of_birth, sl.sl_post, sl.sl_gender,
						COUNT(*) OVER() AS total_count
					FROM tm_student_final_result_set AS sfrs
					INNER JOIN tn_student_list sl
						ON sfrs.sfrs_student_id = sl.id
					${where}
                    ORDER BY CAST(sfrs_marks_gain AS DECIMAL) DESC
					LIMIT ${limit} OFFSET ${offset}
				) as sub
				CROSS JOIN (
					SELECT COUNT(*) AS total_rows
					FROM tm_student_final_result_set sfrs
					INNER JOIN tn_student_list sl
						ON sfrs.sfrs_student_id = sl.id
					${where}
				) AS t;
				`;
    }

    console.log(q, "=q");

    return await db.query(q);
  },

  getExamServerIP: async () => {
    return await db.aouth.findOne({
      attributes: ["exam_server_ip"],
      where: {
        id: 1,
      },
      raw: true,
    });
  },

  saveExamServerIP: async (ip) => {
    return await db.aouth.update({ exam_server_ip: ip }, { where: { id: 1 } });
  },

  getPublishedTests: async (type) => {
    let query = {};
    if (type !== "ALL") {
      query = {
        ptl_test_mode: type,
      };
    }
    let allowedTypes = ["EXAM", "MOCK"];
    if (!allowedTypes.includes(type)) {
      console.log(`Only types allowed are EXAM | MOCK`);
      query = {};
    }

    return await db.tm_publish_test_list.findAll(
      {
        where: query,
      },
      { raw: true },
    );
  },

  generateResult: async (publishedTestId, transact) => {
    let where = "";

    if (publishedTestId != 0) {
      where += `main_test_list.id = ${publishedTestId}`;
    }

    let query = `SELECT
                 main_result.sfrs_publish_id as sfrs_publish_id,
                 main_result.student_id as  sfrs_student_id,
                 main_result.sfrs_student_roll_no as sfrs_student_roll_no,
                 (SUM( main_result.correct ) * main_result.per_question_mark) -
                 (SUM( main_result.wrong ) * main_result.negative_mark) as sfrs_marks_gain,
                 SUM( main_result.correct ) as sfrs_correct,
                 SUM( main_result.wrong ) as sfrs_wrong,
                 SUM( main_result.unatempted ) as sfrs_unattempted,
                 main_result.sfrs_cutoff as   sfrs_cutoff,
                 main_result.sfrc_total_marks as sfrc_total_marks,
                 main_result.sfrs_test_date as sfrs_test_date,
                 IFNULL('EXAM','EXAM') as sfrs_test_info,
                 main_result.sfrs_rem_min as sfrs_rem_min,
                 main_result.sfrs_rem_sec as sfrs_rem_sec
                FROM 
                (SELECT 
                  student_list.sl_roll_number as sfrs_student_roll_no,
                  main_test_list.id as sfrs_publish_id,
                  main_test_list.mt_total_marks as sfrc_total_marks,
                  main_test_list.mt_passing_out_of as   sfrs_cutoff,
                  main_test_list.ptl_active_date as sfrs_test_date,
                  main_test_list.mt_negativ_mark as negative_mark,
                  student_paper.sqp_student_id student_id,
                  student_paper.sqp_ans as student_ans,
                  main_test_list.mt_mark_per_question as per_question_mark,
                  IF(student_paper.sqp_ans = main_paper.q_ans ,1,0) as correct,
                  IF(student_paper.sqp_ans = '',1,IF(student_paper.sqp_ans IS NOT NULL,0,1)) as unatempted,
                  IF(student_paper.sqp_ans <> '' ,IF(student_paper.sqp_ans <> main_paper.q_ans ,1,0),0) as wrong,
                   stud_test_info.stm_min as sfrs_rem_min,
                   stud_test_info.stm_sec as sfrs_rem_sec

                  FROM  
                   tm_publish_test_list as main_test_list 
					INNER JOIN 
						tm_student_question_paper as student_paper 
							ON  
								main_test_list.id = student_paper.sqp_publish_id 

					INNER JOIN 
						tm_test_question_sets as main_paper 
							ON 
								(student_paper.sqp_question_id = main_paper.q_id AND main_test_list.ptl_test_id = main_paper.tqs_test_id) 

					INNER JOIN 
						tn_student_list as student_list 
							ON 
								student_list.id = student_paper.sqp_student_id  
								
					INNER JOIN 
						tm_student_test_list as stud_test_info 
							ON
								(main_test_list.id = stud_test_info.stl_publish_id  AND student_list.id = stud_test_info.stl_stud_id) 

                  WHERE ${where} GROUP BY student_paper.id,student_paper.sqp_student_id ORDER BY student_paper.sqp_student_id
                 ) as main_result
                GROUP BY main_result.student_id`;

    return await db.query(query, { transaction: transact });
  },

  deleteResultsData: async () => {
    let query = `DELETE
							set_1
						FROM 
							tm_student_final_result_set set_1 ,
							tm_student_final_result_set set_2
						WHERE 
							set_1.id < set_2.id AND (
							set_1.sfrs_publish_id = set_2.sfrs_publish_id
							AND set_1.sfrs_student_id = set_2.sfrs_student_id )`;
    return await db.query(query);
  },

  getTestDetails: async (testId) => {
    let q = ` SELECT  
					post_list.mtl_test_name as post_name,
					test.mt_name as test_name,
					test.ptl_active_date as test_date
				FROM 
					tm_publish_test_list as test INNER JOIN 
					tm_master_test_list as post_list 
				ON test.mt_pattern_type = post_list.id
				WHERE test.id = ${testId} LIMIT 1`;
    return await db.query(q);
  },

  getTestReportsForExcel: async (testId) => {
    let q = ` SELECT 
                      IFNULL(student_list.sl_f_name,'') as f_name ,
                      IFNULL(student_list.sl_m_name,'') as m_name ,
                      IFNULL(student_list.sl_l_name,'') as l_name ,
                        sfrc_total_marks as count,
                        student_list.id as student_id,
                        student_list.sl_roll_number as roll_number,
                        student_list.sl_application_number as student_application_no,
                        student_list.sl_post as student_post,
                        student_list.sl_catagory as student_catatory,
                        DATE_FORMAT(student_list.sl_date_of_birth,'%d-%m-%Y') as dob,
                        student_list.sl_contact_number as mobile_number,
                        student_list.sl_image as student_image,
                        IF(sl_is_physical_handicap=0,'No','Yes')as ph,
                        sfrs_correct as correct,
                        sfrs_correct as correct_score,
                        sfrs_unattempted as unattempted,
                        sfrs_wrong as wrong,
                        IFNULL(0,0) as wrong_score,
                        main_test_list.mt_mark_per_question as per_question,
                        IF(main_test_list.mt_negativ_mark='',0,main_test_list.mt_negativ_mark) as negative
                      FROM 
                        tn_student_list as student_list INNER JOIN
                         tm_student_final_result_set as student_paper ON
                        student_paper.sfrs_student_id = student_list.id INNER JOIN 
                        tm_publish_test_list as main_test_list ON
                        main_test_list.id = student_paper.sfrs_publish_id
                        WHERE 
                         main_test_list.id = ${testId}
                          GROUP BY student_paper.sfrs_student_id
                        ORDER BY roll_number`;
    return await db.query(q);
  },

  updatePercentileResult: async (data) => {
    let q = `UPDATE tm_student_final_result_set
					SET
						srfs_percentile = CASE	
					`;
    let ids = [];
    data.forEach((_el) => {
      ids.push(_el.sfrs_student_id);
      q += ` WHEN sfrs_student_id = ${_el.sfrs_student_id} THEN '${_el.srfs_percentile}'`;
    });

    q += ` END `;
    q += ` WHERE sfrs_student_id IN (${[...ids]})`;

    return await db.query(q);
  },

  getStudentActivityLogs: async (filters) => {
    let whereClauses = [];
    let params = [];

    // Apply filters if provided
    if (filters && filters.searchBy && filters.searchValue) {
      if (filters.searchBy === "roll_no") {
        whereClauses.push("eal.roll_no LIKE ?");
        params.push(`%${filters.searchValue}%`);
      } else if (filters.searchBy === "name") {
        whereClauses.push("eal.student_name LIKE ?");
        params.push(`%${filters.searchValue}%`);
      }
    }

    if (filters && filters.batch) {
      whereClauses.push("eal.batch_id = ?");
      params.push(filters.batch);
    }
    if (filters && filters.exam_name) {
      whereClauses.push("eal.exam_name LIKE ?");
      params.push(`%${filters.exam_name}%`);
    }
    if (filters && filters.date) {
      whereClauses.push("DATE(eal.created_at) = ?");
      params.push(filters.date);
    }

    let whereString =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    let q = `
            SELECT 
                eal.*,
                sl.sl_post AS post,
                DATE_FORMAT(eal.created_at, '%d-%m-%Y %h:%i %p') AS date_time,
                'Success' AS status 
            FROM ${process.env.MASTER_DB_NAME}.exam_activity_log AS eal
            LEFT JOIN tn_student_list AS sl ON eal.roll_no COLLATE utf8mb4_unicode_ci = sl.sl_roll_number COLLATE utf8mb4_unicode_ci
            ${whereString}
            ORDER BY eal.log_id ASC
        `;

    try {
      return await db.query(q, params);
    } catch (error) {
      console.error("Error in getStudentActivityLogs:", error);
      return [[{ log_id: "ERROR", message: error.message }]];
    }
  },

  getActivityLogFilters: async () => {
    try {
      let qBatch = `SELECT DISTINCT batch_id FROM ${process.env.MASTER_DB_NAME}.exam_activity_log WHERE batch_id IS NOT NULL ORDER BY batch_id ASC`;
      let qExam = `SELECT DISTINCT exam_name FROM ${process.env.MASTER_DB_NAME}.exam_activity_log WHERE exam_name IS NOT NULL AND exam_name != '' ORDER BY exam_name ASC`;

      const [batches] = await db.query(qBatch);
      const [exams] = await db.query(qExam);

      return {
        batches: batches.map((b) => b.batch_id),
        exams: exams.map((e) => e.exam_name),
      };
    } catch (error) {
      console.error("Error in getActivityLogFilters:", error);
      return { batches: [], exams: [] };
    }
  },
};

export default reportsModel;
