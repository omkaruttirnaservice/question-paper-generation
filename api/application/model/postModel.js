import db from '../config/db.connect.js';
const postModel = {
	getPostList: () => {
		return db.query(`SELECT 
												m_test_list.*, 
												COUNT(m_tl.id) AS total_topics
											FROM
													tm_master_test_list AS m_test_list
															LEFT JOIN
													tm_main_topic_list AS m_tl ON m_test_list.id = m_tl.mtl_master_test_list_id
											GROUP BY mtl_test_name;`);
	},

	addPost: (d) => {
		return db.query(
			`INSERT INTO 
				tm_master_test_list (
					mtl_test_name,
					mtl_long_form,
					mtl_test_desc,
					added_time,
					added_date,
					added_time_stamp,
					mtl_is_active)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				d.mtl_test_name,
				d.mtl_long_form,
				d.mtl_test_desc,
				d.added_time,
				d.added_date,
				d.added_time_stamp,
				d.mtl_is_active,
			]
		);
	},
};

export default postModel;
