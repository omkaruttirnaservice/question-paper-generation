import * as Yup from 'yup';

const TestListSchemaYUP = Yup.object().shape({
	publish_date: Yup.string().required('Enter publish date'),
	batch: Yup.string().required('Select batch'),
	test_key: Yup.string().required('Please generate test key'),
	selected_posts: Yup.array()
		.min(1, 'Please select post')
		.required('Please select post'),
	server_ip_address: Yup.string('Please select server ip').required(
		'Please select server ip'
	),
});

export default TestListSchemaYUP;
