### Table and column names

================================================================================

- tm_master_test_list = `stores main post list`

  mtl_test_name: `actual post name`
  mtl_long_form: `long form `
  mtl_test_desc: `description of the test`
  added_time: `Added time`
  added_date:`added date`
  added_time_stamp: `time stamp`
  mtl_is_active: `test active status`

================================================================================

- tm_main_topic_list = `stores subjects list`

  mtl_master_test_list_id = `id of the tm_master_test_list`
  mtl_name = `actual subject / topic name`
  mtp_added_aouth_id = 1,
  mtl_added_time = `Added time`
  mtl_added_date = `added date`
  mtl_time_stamp = `time stamp`
  mtl_is_live = 1,
  type = `Admin = 1 OR else = 2`

================================================================================

- tm_sub_topic_list = `stores sub topics of the subject`

  stl_name=`actual topic name`
  stl_master_test_id=`id of tm_master_test_list`
  stl_main_topic_list_id= `subject_id`
  stl_added_date= `added date`
  stl_added_time= `added time`
  stl_time_stamp= `added time stamp`

================================================================================

- tm_mega_question_set = `stores question data`

  mqs_question = `question`
  mqs_opt_one = `option A`
  mqs_opt_two= `option B`
  mqs_opt_three= `option C`
  mqs_opt_four= `option D`
  mqs_opt_five= `option E`
  mqs_type = `question type MCQ = 1`
  mqs_ask_in_month = `month when the question is asked previously`
  mqs_ask_in_year = `year when the question is asked previously`
  mqs_ans = `correct option of the question`
  mqs_solution = `solutions of the question`
  mqs_leval = `difficulty level easy = 1, medium = 2, hard = 3`
  mqs_added_by = `Added by Admin = 1`
  mqs_section_id = `subject id of the question`
  mqs_chapter_id = `topic id of the question`
  mqs_added_date = `added date`
  mqs_added_time = `added time`
  mqs_is_trash = `if question is deleted (this only hides question from actual list but dont remove it completely) then set to 1 else set to 0`
  msq_publication = `publication name of questin`
  msq_book_name = `book name from where question is taken`
  maq_page_number = `page number of the book`

================================================================================

- tm_test_user_master_list = `stores the created tests`

  mt_name = `actual test name`
  mt_added_date = `date`
  mt_descp = `description of the test`
  mt_added_time = `time`
  mt_is_live = `live status 1=live, 0=not live`
  mt_time_stamp = `time stamp`
  mt_type = `test type 1=mcq`
  tm_aouth_id = `1=admin`
  mt_test_time = `test duration`
  mt_total_test_takan =
  mt_is_negative = `does test have negative marking 1=yes, 0=no`
  mt_negativ_mark = `if test have negative marking, then what is the value of negative marking`
  mt_mark_per_question = `marks per question`
  mt_passing_out_of = `passing marks of test`
  mt_total_marks = `total test marks`
  mt_pattern_type =
  mt_total_test_question = `total questions in test`

============================================================================================

- tm_test_question_sets = `question list of the created test this is linked with tqs_test_id`

  q_id = `question id`
  tqs_test_id = `id of table=tm_test_user_master_list`
  section_id =
  section_name =
  sub_topic_id = `id of table=tm_sub_topic_list (this is the topic id)`
  sub_topic_section = `name of the topic`
  main_topic_id = `id of table=tm_main_topic_list (this is the subject id)`
  main_topic_name = `name of the subject`
  q = `actual question`
  q_a = `option A`
  q_b = `option B`
  q_c = `option C`
  q_d = `option D`
  q_e = `option E`
  q_display_type = type of question 1 = mcq, 2= , 3= ,4=
  q_ask_in
  q_data_type
  q_mat_data
  q_col_a
  q_col_b
  q_mat_id
  q_i_a
  q_i_b
  q_i_c
  q_i_d
  q_i_e
  q_i_q
  q_i_sol
  stl_topic_number
  sl_section_no
  q_sol
  q_ans
  q_mat_ans
  q_mat_ans_row
  q_col_display_type
  question_no
  mark_per_question
  tqs_question_id
  tqs_chapter_id =
  tqs_section_id =
  pub_name = `publication name`
  book_name = `book name`
  page_name = `page no of the book`

========================================================

- tm_publish_test_list `stores the published tests`

  id = `published test id`
  ptl_active_date = `exam date (i.e. when exam will be conducted)`
  ptl_time =
  ptl_link = `published test link (stored in base 64)`
  ptl_test_id = `id of tm_test_master_list`
  ptl_added_date = `when test is published date`
  ptl_added_time = `when test is published time`
  ptl_time_tramp = `when test is published time stamp`
  ptl_test_description =
  ptl_is_live = `test live status`
  ptl_aouth_id =
  ptl_is_test_done = `test complete status`
  ptl_test_info = `all test info`
  mt_name = `name of the master test`
  mt_added_date = `created date of master test (tm_test_user_master_list)`
  mt_descp = `description of master test (tm_test_user_master_list)`
  mt_is_live = `live status of master test (tm_test_user_master_list)`
  mt_time_stamp =
  mt_type = `type of master test (tm_test_user_master_list)`
  tm_aouth_id =
  mt_test_time = `time of master test (tm_test_user_master_list)`
  mt_total_test_takan = `total test taken of master test (tm_test_user_master_list)`
  mt_is_negative = `test does have negative marking`
  mt_negativ_mark = `if negative mark then number of negative mark`
  mt_mark_per_question = `marks per question`
  mt_passing_out_of =`passing marks`
  mt_total_marks = `total test marks`
  mt_pattern_type =
  mt_total_test_question = `total questions in test`
  mt_added_time = `master test added time`
  ptl_link_1 = `test link created when test is published`
  tm_allow_to = `batch number`
  ptl_test_mode =
  is_test_loaded =
  is_student_added =
  ptl_master_exam_id =
  ptl_master_exam_name =
  is_test_generated =
  is_push_done=

================================================================================
