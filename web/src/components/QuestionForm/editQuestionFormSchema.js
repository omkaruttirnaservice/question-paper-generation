import * as Yup from 'yup';

const editQuestionFormSchema = Yup.object().shape({
	question_content: Yup.string().required('Enter question'),
	option_A: Yup.string().required('Enter option A'),
	option_B: Yup.string().required('Enter option B'),
	option_C: Yup.string().required('Enter option C'),
	option_D: Yup.string().required('Enter option D'),
	correct_option: Yup.string().required('Enter correct option'),
});
export default editQuestionFormSchema;
