import * as Yup from 'yup';

const TestListSchemaYUP = Yup.object().shape({
    publish_date: Yup.string().required('Enter publish date'),
    batch: Yup.string().required('Select batch'),
    test_key: Yup.string().required('Please generate test key'),
    selected_posts: Yup.array()
        .min(1, 'Please select at least one post')
        .required('Please select post'),
    server_ip_address: Yup.string('Please select server ip').required('Please select server ip'),
    is_show_exam_sections: Yup.string('Please select weather to show sections or not').required(
        'Please select weather to show sections or not'
    ),
    is_show_mark_for_review: Yup.string('Please select option').required('Please select option'),
    end_button_time: Yup.number('Please enter valid time')
        .typeError('Please enter valid number')
        .required('Please enter valid time'),
});

export default TestListSchemaYUP;
