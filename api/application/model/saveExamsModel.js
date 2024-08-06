import sequelize from '../config/db-connect-migration.js';

const saveExamsModel = {
	getStudentExamReportDetails: ({ stud_roll, pub_test_id }) => {
		let q = `
        SELECT * 
        FROM tm_student_final_result_set sfrs

        INNER JOIN
            tm_publish_test_list ptl
                ON 
                    sfrs.sfrs_publish_id = ptl.id
        WHERE
            sfrs.sfrs_student_id = ${stud_roll}
        ;`;

		return sequelize.query(q);
	},

	getStudentQuestionPaper: ({ stud_roll, pub_test_id }) => {
		let q = `
        SELECT * 
        FROM 
            tm_student_question_paper sqp
        INNER JOIN
            tm_test_question_sets tqs
        ON
            sqp.sqp_question_id = tqs.q_id
        
        WHERE
            sqp.sqp_student_id = ${+stud_roll} AND
            sqp.sqp_test_id = ${+pub_test_id}
        
        `;
		return sequelize.query(q);
	},
};
export default saveExamsModel;
