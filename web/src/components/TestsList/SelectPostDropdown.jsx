import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getPostList } from '../StudentArea/AddNewStudent/api.jsx';
import { toast } from 'react-toastify';
import { InputLabel } from '../UI/Input.jsx';
import { IoRefresh } from 'react-icons/io5';
import { IoIosArrowDropdown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';

function SelectPostDropdown({
	publishExamForm,
	serverIPAddresses,
	setPublishExamForm,
	errors,
}) {

    console.log(errors, '==errors==')
	const serverIPAddress = serverIPAddresses.find(
		(el) => el.id == publishExamForm.server_ip_address
	);

	if (!serverIPAddress) return;

	const [showDropdown, setShowDropdown] = useState(false);
	const [postToPublishTest, setPostToPublishTest] = useState([]);
	const [postList, setPostList] = useState([]);

	const postsListQuery = useQuery({
		queryKey: [
			'GET POST LIST FROM SERVER(FORM FILLING PANEL)',
			serverIPAddress,
		],
		queryFn: () => getPostList(serverIPAddress),
		refetchOnMount: false,
		retry: false,
		enabled: !!serverIPAddress,
	});

	useEffect(() => {
		if (postsListQuery.error) {
			const error = postsListQuery.error;
			toast(error?.message || 'Unable to get posts list.');
		}
	}, [postsListQuery.error]);

	useLayoutEffect(() => {
		if (serverIPAddress?.length > 0) {
			setPostList([]);
			postsListQuery.refetch();
		}
	}, []);

	useEffect(() => {
		if (postsListQuery?.data) {
			setPostList(JSON.parse(postsListQuery?.data?.data?.data) || []);
		}
	}, [postsListQuery.data]);

	const addPostToPublishHandler = (newPost) => {
		setPostList((prev) => {
			const filteredList = prev.filter(
				(_post) => _post.ca_post_id != newPost.ca_post_id
			);
			return filteredList;
		});

		setPostToPublishTest((prev) => {
			return [...prev, newPost];
		});
	};

	useEffect(() => {
		if (postToPublishTest?.length == 0) return;
		setPublishExamForm((prev) => {
			return {
				...prev,
				selected_posts: postToPublishTest,
			};
		});
	}, [postToPublishTest]);

	const removePostFromPublishList = (post) => {};

	return (
		<>
			<InputLabel
				name="Select Post"
				icon={
					<IoRefresh
						className={`${
							postsListQuery.isPending || postsListQuery.isRefetching
								? 'animate-spin'
								: ''
						}`}
					/>
				}
				onClick={() => {
					postsListQuery.refetch();
				}}
			/>

			<div>
				<button className="cursor-pointer relative !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40">
					{postToPublishTest.length === 0 && <span>-- Select -- </span>}

					<IoIosArrowDropdown
						className={`text-xl justify-self-end absolute right-2 top-[50%] translate-y-[-50%] transition-all duration-300 ${
							showDropdown ? 'rotate-180' : ''
						}`}
						onClick={() => setShowDropdown(!showDropdown)}
					/>

					{postToPublishTest.length > 0 &&
						postToPublishTest.map((postToPublish) => {
							return (
								<p className="bg-lime-200 p-1 w-fit mx-1 inline-block">
									<div className="flex items-center gap-1">
										<span>{postToPublish.ca_post_name}</span>

										<span className="" onClick={removePostFromPublishList}>
											<FaXmark
												onClick={() => {
													const filteredList = postToPublishTest.filter(
														(post) =>
															post.ca_post_id != postToPublish.ca_post_id
													);
													setPostToPublishTest(filteredList);
													setPostList((prev) => {
														return [...prev, postToPublish];
													});
												}}
											/>
										</span>
									</div>
								</p>
							);
						})}
				</button>

				<ul
					className={`absolute transition-all duration-300 ${
						!showDropdown ? 'h-0 overflow-hidden' : 'h-full  overflow-y-auto'
					} left-0 z-50  bg-slate-300 w-full max-h-32 `}
				>
					{postList.map((post) => {
						return (
							<li
								className="list-item relative p-2"
								onClick={(e) => {
									addPostToPublishHandler(post);
								}}
							>
								<label htmlFor={post.ca_post_id} className="cursor-pointer">
									{post.ca_post_name}
								</label>
							</li>
						);
					})}

					{postList.length === 0 && (
						<li className="p-2">No items available.</li>
					)}
				</ul>

				{errors.selected_posts && (
					<span className="error">{errors.selected_posts}</span>
				)}
			</div>
		</>
	);
}

export default memo(SelectPostDropdown);
