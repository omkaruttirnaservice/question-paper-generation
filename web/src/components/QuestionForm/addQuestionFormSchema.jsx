import * as Yup from 'yup';

const addQuestionFormSchema = Yup.object().shape({
	post_id: Yup.string().required('Select Post'),
	subject_id: Yup.number().required('Select subject'),
	topic_id: Yup.number().required('Select topic'),
	// pub_name: Yup.string().required('Enter publication name'),
	// book_name: Yup.string().when('pub_name', {
	// 	is: (pub_name) => pub_name && pub_name.length > 0,
	// 	then: Yup.string().required('Enter book name'),
	// }),
	// pg_no: Yup.string().when('pub_name', {
	// 	is: (pub_name) => pub_name && pub_name.length > 0,
	// 	then: Yup.string().required('Page number is required'),
	// }),
	question_content: Yup.string().required('Enter question'),
	option_A: Yup.string().required('Enter option A'),
	option_B: Yup.string().required('Enter option B'),
	option_C: Yup.string().required('Enter option C'),
	option_D: Yup.string().required('Enter option D'),

	correct_option: Yup.string().required('Enter correct option'),
});
export default addQuestionFormSchema;
