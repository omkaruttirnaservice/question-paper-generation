import * as Yup from 'yup';

const TestListSchemaYUP = Yup.object().shape({
	publish_date: Yup.string().required('Enter publish date'),
	batch: Yup.string().required('Select batch'),
	test_key: Yup.string().required('Please generate test key'),
});

export default TestListSchemaYUP;
