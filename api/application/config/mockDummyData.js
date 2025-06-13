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
            if (count == 4) count = 0;
            else count++;
            let currentQuestion = questions[count];
            // currentQuestion['createdAt'] = myDate.getDateTime();
            // currentQuestion['updatedAt'] = myDate.getDateTime();
            insertArray.push(currentQuestion);
        }
        return insertArray;
    },
};

const questions = [
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: "<p>'सिंह जंगलात फिरतो' या वाक्यातील क्रियापद ओळखा.</p>",
        q_a: '<p>सिंह</p>',
        q_b: '<p>जंगलात</p>',
        q_c: '<p>फिरतो</p>',
        q_d: '<p>वाक्य</p>',
        q_e: '',
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
        mqs_leval: null,
    },
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: '<p>Identify the correct sentence:</p>',
        q_a: "<p>She don't likes mangoes.</p>",
        q_b: "<p>She doesn't like mangoes.</p>",
        q_c: "<p>She doesn't likes mango.</p>",
        q_d: "<p>She don't like mango.</p>",
        q_e: '',
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
        mqs_leval: null,
    },
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: '<p>Who was the first woman to go to space?</p><br > <p> अंतराळात गेलेली पहिली महिला कोण होती?</p>',
        q_a: '<p>Kalpana Chawla / कल्पना चावला</p>',
        q_b: '<p>Sally Ride / सॅली रायड</p>',
        q_c: '<p>Valentina Tereshkova / व्हॅलेंटीना टेरेश्कोव्हा</p>',
        q_d: '<p>Sunita Williams / सुनीता विल्यम्स</p>',
        q_e: '',
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
        mqs_leval: null,
    },
    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: `<p>What shape is shown in the image below?<br>खालील चित्रात कोणती आकृती दर्शविली आहे?<br><img src="data:image/png;base64,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" alt="Octagon" style="max-width: 200px; margin-top: 10px;" /></p>`,
        q_a: '<p>Triangle / त्रिकोण</p>',
        q_b: '<p>Hexagon / सहभुज</p>',
        q_c: '<p>Pentagon / पंचभुज</p>',
        q_d: '<p>Octagon / अष्टभुज</p>',
        q_e: '',
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
        mqs_leval: null,
    },

    {
        q_id: getRandomNumber(50, 10),
        tqs_test_id: 2,
        section_id: 0,
        section_name: '-',
        sub_topic_id: getRandomNumber(20, 10),
        sub_topic_section: 'Sub Topic-' + getRandomNumber(10, 1),
        main_topic_id: 3,
        main_topic_name: 'Main topic',
        q: '<p>What is the value of (15 × 2) + (30 ÷ 5)?<br></p> <p> (१५ × २) + (३० ÷ ५) याचे उत्तर काय आहे?</p>',
        q_a: '<p>Triangle / त्रिकोण</p>',
        q_b: '<p>Hexagon / सहभुज</p>',
        q_c: '<p>Pentagon / पंचभुज</p>',
        q_d: '<p>Octagon / अष्टभुज</p>',
        q_e: '',
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
        mqs_leval: null,
    },
];

const _questions = [
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
        q: 'What is the value of ( x ) in the equation ( 4(x + 3) - 5 = 23 )?',
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
        mqs_leval: null,
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
        q: 'If ( f(x) = x^3 - 6x^2 + 9x + 1 ), find the critical points of the function.',
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
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
        mqs_leval: null,
    },
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
