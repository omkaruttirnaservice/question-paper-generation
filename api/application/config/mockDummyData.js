import { getRandomNumber } from '../utils/help.js';
import { myDate } from './utils.js';
const mockDummyData = {
    testDetails: (_testData) => {
        let date = _testData.exam_date;
        let time = _testData.exam_time;
        let dateTime = _testData.exam_date_time;
        let testLink = btoa(getRandomNumber(1000, 9999));
        return {
            ptl_active_date: date,
            ptl_time: 0,
            ptl_link: testLink,
            ptl_link_1: Math.floor(Math.random() * 3000) + 1000,
            ptl_test_id: 2,
            ptl_master_exam_id: 0,
            ptl_master_exam_name: '-',
            ptl_added_date: date,
            ptl_added_time: time,
            ptl_time_stamp: dateTime,
            ptl_test_description: 'Mock test',
            ptl_is_live: 1,
            ptl_aouth_id: 1,
            ptl_is_test_done: 0,
            ptl_test_info: {},
            mt_name: _testData.mt_name,
            mt_added_date: date,
            mt_descp: 'test',
            mt_is_live: 1,
            mt_time_stamp: dateTime,
            mt_type: 2,
            tm_aouth_id: 1,
            mt_test_time: `${_testData.test_duration}`,
            mt_total_test_takan: 0,
            mt_is_negative: 0,
            mt_negativ_mark: 0,
            mt_mark_per_question: _testData.marks_per_question,
            mt_passing_out_of: 20,
            mt_total_marks: `${_testData.total_marks}`,
            mt_pattern_type: 2,
            mt_total_test_question: `${_testData.total_questions}`,
            mt_added_time: time,
            mt_pattern_name: '-',
            is_test_generated: 0,
            ptl_test_mode: _testData.test_mode,
            tm_allow_to: _testData.batch_no,
            is_test_loaded: 1,
            is_student_added: 1,
            is_uploaded: 0,
            is_start_exam: 0,
            is_absent_mark: 0,
            is_exam_downloaded: 1,
            is_photos_downloaded: 1,
            is_sign_downloaded: 1,
            is_final_published: 1,
            is_students_downloaded: 1,
            center_code: _testData.center_code,
        };
    },

    studentDummyData: (_testData) => {
        let insertArray = [];
        for (let i = 0; i < _testData.total_candidates; ++i) {
            let roll_n_id = _testData.start_roll_number + i;
            insertArray.push({
                id: roll_n_id,
                sl_f_name: 'DEMO',
                sl_m_name: 'DEMO',
                sl_l_name: 'DEMO',
                sl_image: 'photo_demo.jpg',
                sl_sign: 'sign_demo.jpg',
                sl_email: 'demo@demo.demo',
                sl_father_name: 'DEMO',
                sl_mother_name: 'DEMO',
                sl_address: 'DEMO Address',
                sl_mobile_number_parents: '9999999999',
                sl_tenth_marks: '-',
                sl_contact_number: '9999999999',
                sl_class: '-',
                sl_roll_number: roll_n_id,
                sl_subject: '-',
                sl_stream: '-',
                sl_addmit_type: '-',
                sl_time: _testData.exam_time,
                sl_date: _testData.exam_date,
                sl_time_stamp: _testData.exam_date_time,
                sl_added_by_login_id: 1,
                sl_is_live: 1,
                sl_date_of_birth: '1999-01-01',
                sl_school_name: 'DEMO SCHOOL',
                sl_catagory: 'DEMO CATEGORY',
                sl_application_number: 1000 + i,
                sl_is_physical_handicap: 0,
                sl_is_physical_handicap_desc: 0,
                sl_post_id: _testData.post_id,
                sl_post: _testData.post_name,
                sl_center_code: _testData.center_code,
                sl_batch_no: _testData.batch_no,
                sl_exam_date: _testData.exam_date,
                sl_password: _testData.default_password,
                sl_present_status: 1,
                sl_cam_image: '-',
                sl_qr_image: '-',
                sl_is_qr_captured: 'NO',
                center_id: '-',
                floot: '-',
                department: '-',
                lab_no: '-',
                lab_name: '-',
                pc_no: '-',
                createdAt: myDate.getDateTime(),
                updatedAt: myDate.getDateTime(),
            });
        }
        return insertArray;
    },

    getDummyQuestion: (_testData) => {
        let insertArray = [];
        let count = 0;
        for (let i = 0; i < _testData.total_questions; ++i) {
            if (count == 9) count = 0;
            else count++;
            let currentQuestion = questions[count];
            // currentQuestion['createdAt'] = myDate.getDateTime();
            // currentQuestion['updatedAt'] = myDate.getDateTime();

            insertArray.push(currentQuestion);
        }
        return insertArray;
    },
};

// prettier-ignore

const questions = [
    // maths 1
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'What is the value of \( x \) in the equation \( 4(x + 3) - 5 = 23 \)?',
        q_a: '2',
        q_b: '3',
        q_c: '4',
        q_d: '5',
        q_e: '6',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>4</p>',
        q_ans: 'c',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // maths 2
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'If \( f(x) = x^3 - 6x^2 + 9x + 1 \), find the critical points of the function.',
        q_a: '0, 3',
        q_b: '1, 3',
        q_c: '2, 3',
        q_d: '1, 2',
        q_e: '-',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>1, 3</p>',
        q_ans: 'b',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // english 1
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'Choose the correct form of the verb: "She ___ to the store every Saturday."',
        q_a: 'go',
        q_b: 'goes',
        q_c: 'going',
        q_d: 'gone',
        q_e: 'goneing',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>goes</p>',
        q_ans: 'b',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // english 2
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'What is the antonym of "difficult"?',
        q_a: 'Easy',
        q_b: 'Hard',
        q_c: 'Simple',
        q_d: 'Complex',
        q_e: 'Challenging',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>Easy</p>',
        q_ans: 'a',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // marathi 1
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'खालील वाक्यात योग्य क्रियापद निवडा: "तो ___ शाळेत जातो."',
        q_a: 'जाता',
        q_b: 'जातो',
        q_c: 'गेला',
        q_d: 'गडबड',
        q_e: 'जाणार',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>जातो</p>',
        q_ans: 'b',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // marathi 2
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'खालील वाक्यात योग्य विशेषण निवडा: "तो एक ___ मुलगा आहे."',
        q_a: 'सुंदर',
        q_b: 'साधा',
        q_c: 'मोठा',
        q_d: 'धाडसी',
        q_e: 'शांत',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>सुंदर</p>',
        q_ans: 'a',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // GK 1
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'Which planet is known as the Red Planet?',
        q_a: 'Earth',
        q_b: 'Mars',
        q_c: 'Jupiter',
        q_d: 'Saturn',
        q_e: 'Venus',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>Mars</p>',
        q_ans: 'b',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // GK 2
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'What is the capital of France?',
        q_a: 'Berlin',
        q_b: 'Madrid',
        q_c: 'Paris',
        q_d: 'Rome',
        q_e: 'Lisbon',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>Paris</p>',
        q_ans: 'c',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // Logical 1
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'If all roses are flowers and some flowers fade quickly, which of the following is true?',
        q_a: 'Some roses fade quickly.',
        q_b: 'All roses fade quickly.',
        q_c: 'No roses fade quickly.',
        q_d: 'Some flowers are not roses.',
        q_e: 'All flowers are roses.',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>Some flowers are not roses.</p>',
        q_ans: 'd',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    },

    // logical 2
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: 'A is taller than B, and B is taller than C. Who is the tallest?',
        q_a: 'A',
        q_b: 'B',
        q_c: 'C',
        q_d: 'Cannot be determined.',
        q_e: 'All are of equal height.',
        q_display_type: 1,
        q_ask_in: '-',
        q_data_type: '-',
        q_mat_data: '-',
        q_col_a: '-',
        q_col_b: '-',
        q_mat_id: 0,
        q_i_a: 0,
        q_i_b: 0,
        q_i_c: 0,
        q_i_d: 0,
        q_i_e: 0,
        q_i_q: 0,
        q_i_sol: 0,
        stl_topic_number: 0,
        sl_section_no: 0,
        q_sol: '<p>A</p>',
        q_ans: 'a',
        q_mat_ans: '-',
        q_mat_ans_row: '-',
        q_col_display_type: 1,
        question_no: '-',
        mark_per_question: 1,
        tqs_question_id: null,
        tqs_chapter_id: null,
        tqs_section_id: null,
        pub_name: null,
        book_name: null,
        page_name: null,
        mqs_ask_in_month: null,
        mqs_ask_in_year: null,
        mqs_leval: null
    }
];

const _question = [
    // maths 1
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'What is the value of ( x ) in the equation ( 4(x + 3) - 5 = 23 )?', // q:
        '2', // q_a:
        '3', // q_b:
        '4', // q_c:
        '5', // q_d:
        '6', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>4</p>', // q_sol:
        'c', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // maths 2
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'If ( f(x) = x^3 - 6x^2 + 9x + 1 ), find the critical points of the function.', // q:
        '0, 3', // q_a:
        '1, 3', // q_b:
        '2, 3', // q_c:
        '1, 2', // q_d:
        '-', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>1, 3</p>', // q_sol:
        'b', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // english 1
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'Choose the correct form of the verb: "She ___ to the store every Saturday."', // q:
        'go', // q_a:
        'goes', // q_b:
        'going', // q_c:
        'gone', // q_d:
        'goneing', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>goes</p>', // q_sol:
        'b', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // english 2
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'What is the antonym of "difficult"?', // q:
        'Easy', // q_a:
        'Hard', // q_b:
        'Simple', // q_c:
        'Complex', // q_d:
        'Challenging', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>Easy</p>', // q_sol:
        'a', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // marathi 1
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'खालील वाक्यात योग्य क्रियापद निवडा: "तो ___ शाळेत जातो."', // q:
        'जाता', // q_a:
        'जातो', // q_b:
        'गेला', // q_c:
        'गडबड', // q_d:
        'जाणार', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>जातो</p>', // q_sol:
        'b', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // marathi 2
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'खालील वाक्यात योग्य विशेषण निवडा: "तो एक ___ मुलगा आहे."', // q:
        'सुंदर', // q_a:
        'साधा', // q_b:
        'मोठा', // q_c:
        'धाडसी', // q_d:
        'शांत', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>सुंदर</p>', // q_sol:
        'a', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // GK 1
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'Which planet is known as the Red Planet?', // q:
        'Earth', // q_a:
        'Mars', // q_b:
        'Jupiter', // q_c:
        'Saturn', // q_d:
        'Venus', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>Mars</p>', // q_sol:
        'b', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // GK 2
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'What is the capital of France?', // q:
        'Berlin', // q_a:
        'Madrid', // q_b:
        'Paris', // q_c:
        'Rome', // q_d:
        'Lisbon', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>Paris</p>', // q_sol:
        'c', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // Logical 1
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'If all roses are flowers and some flowers fade quickly, which of the following is true?', // q:
        'Some roses fade quickly.', // q_a:
        'All roses fade quickly.', // q_b:
        'No roses fade quickly.', // q_c:
        'Some flowers are not roses.', // q_d:
        'All flowers are roses.', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>Some flowers are not roses.</p>', // q_sol:
        'd', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],

    // logical 2
    [
        getRandomNumber(50, 10), // q_id
        2, // tqs_test_id:
        0, // section_id:
        '-', // section_name:
        getRandomNumber(20, 10), // sub_topic_id:
        'Sub Topic' + '-' + getRandomNumber(10, 1), // sub_topic_section:
        3, // main_topic_id:
        'Main topic', // main_topic_name:
        'A is taller than B, and B is taller than C. Who is the tallest?', // q:
        'A', // q_a:
        'B', // q_b:
        'C', // q_c:
        'Cannot be determined.', // q_d:
        'All are of equal height.', // q_e:
        1, // q_display_type:
        '-', // q_ask_in:
        '-', // q_data_type:
        '-', // q_mat_data:
        '-', // q_col_a:
        '-', // q_col_b:
        0, // q_mat_id:
        0, // q_i_a:
        0, // q_i_b:
        0, // q_i_c:
        0, // q_i_d:
        0, // q_i_e:
        0, // q_i_q:
        0, // q_i_sol:
        0, // stl_topic_number:
        0, // sl_section_no:
        '<p>A</p>', // q_sol:
        'a', // q_ans:
        '-', // q_mat_ans:
        '-', // q_mat_ans_row:
        1, // q_col_display_type:
        '-', // question_no:
        1, // mark_per_question:
    ],
];

// prettier-ignore
// var question = [
// 	getRandomNumber(50, 10),                            // q_id
// 	2,												 //tqs_test_id:
// 	0,												 //section_id:
// 	'-',											 //section_name:
// 	getRandomNumber(20, 10),							 //sub_topic_id:
// 	'Sub Topic' + '-' + getRandomNumber(10, 1),		 //sub_topic_section:
// 	3,												 //main_topic_id:
// 	'Main topic',									 //main_topic_name:
// 	'What is Your name?',							 //q:
// 	'a',										     //q_a:
// 	'b',										     //q_b:
// 	'c',										     //q_c:
// 	'd',										     //q_d:
// 	'e',										     //q_e:
// 	1,												 //q_display_type:
// 	'-',										     //q_ask_in:
// 	'-',										     //q_data_type:
// 	'-',										     //q_mat_data:
// 	'-',										     //q_col_a:
// 	'-',										     //q_col_b:
// 	0,												 //q_mat_id:
// 	0,												 //q_i_a:
// 	0,												 //q_i_b:
// 	0,												 //q_i_c:
// 	0,												 //q_i_d:
// 	0,												 //q_i_e:
// 	0,												 //q_i_q:
// 	0,												 //q_i_sol:
// 	0,												 //stl_topic_number:
// 	0,												 //sl_section_no:
// 	'<p>Name</p>',									 //q_sol:
// 	'c',											 //q_ans:
// 	'-',											 //q_mat_ans:
// 	'-',											 //q_mat_ans_row:
// 	1,												 //q_col_display_type:
// 	'-',											 //question_no:
// 	1,												 //mark_per_question:
// ]

export default  mockDummyData

// [
//                 {
//                     test_id: '2',
//                     test_name: 'Mock-' + (Math.floor(Math.random() * 300) + 100),
//                     test_created_on: dateTime,
//                     test_descp: 'Test',
//                     test_type: 'On paper',
//                     test_duration: `${_testData.test_duration} Min`,
//                     test_negative: 'No',
//                     test_mark_per_q: '1',
//                     passing_out_of: '10',
//                     test_total_marks: '13',
//                     test_pattern: 'SDE',
//                     test_total_question: `${_testData.total_questions}`,
//                     id: '2',
//                     mt_name: '-',
//                     mt_added_date: '2024-04-16',
//                     mt_descp: 'Test',
//                     mt_added_time: '12:29:26',
//                     mt_is_live: '1',
//                     mt_time_stamp: '2024-04-16 12:29:26',
//                     mt_type: '2',
//                     tm_aouth_id: '1',
//                     mt_test_time: '90',
//                     mt_total_test_takan: '0',
//                     mt_is_negative: '0',
//                     mt_negativ_mark: '',
//                     mt_mark_per_question: '1',
//                     mt_passing_out_of: '20',
//                     mt_total_marks: `${_testData.total_marks}`,
//                     mt_pattern_type: '2',
//                     mt_total_test_question: `${_testData.total_questions}`,
//                 },
//             ]
