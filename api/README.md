### Table and column names

- tm_master_test_list = `stores main post list`
  mtl_test_name: `actual post name`
  mtl_long_form: `long form `
  mtl_test_desc: `description of the test`
  added_time: `Added time`
  added_date:`added date`
  added_time_stamp: `time stamp`
  mtl_is_active: `test active status`

- tm_main_topic_list = `stores subjects list`
  mtl_master_test_list_id = `id of the tm_master_test_list`
  mtl_name = `actual subject / topic name`
  mtp_added_aouth_id = 1,
  mtl_added_time = `Added time`
  mtl_added_date = `added date`
  mtl_time_stamp = `time stamp`
  mtl_is_live = 1,
  type = `Admin = 1 OR else = 2`

- tm_sub_topic_list = `stores sub topics of the subject`
  stl_name=`actual topic name`
  stl_master_test_id=`id of tm_master_test_list`
  stl_main_topic_list_id= `subject_id`
  stl_added_date= `added date`
  stl_added_time= `added time`
  stl_time_stamp= `added time stamp`

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

-tm_test_user_master_list = `stores the created tests`
mt_name =
mt_added_date =
mt_descp =
mt_added_time =
mt_is_live =
mt_time_stamp =
mt_type =
tm_aouth_id =
mt_test_time =
mt_total_test_takan =
mt_is_negative =
mt_negativ_mark =
mt_mark_per_question =
mt_passing_out_of =
mt_total_marks =
mt_pattern_type =
mt_total_test_question =

-tm_test_question_sets = `question list of the created test this is linked with tqs_test_id`
id
q_id
tqs_test_id
section_id
section_name
sub_topic_id
sub_topic_section
main_topic_id
main_topic_name
q longtext
q_a longtext
q_b longtext
q_c longtext
q_d longtext
q_e longtext
q_display_type
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
tqs_chapter_id
tqs_section_id
pub_name
book_name
page_name
