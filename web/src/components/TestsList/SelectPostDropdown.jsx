import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getPostList } from '../StudentArea/AddNewStudent/api.jsx';
import { toast } from 'react-toastify';
import { InputLabel } from '../UI/Input.jsx';
import { IoRefresh } from 'react-icons/io5';
import { IoIosArrowDropdown } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import { MdWork } from 'react-icons/md';

function SelectPostDropdown({ publishExamForm, serverIPAddresses, setPublishExamForm, errors }) {
    console.log(errors, '==errors==');

    const serverIPAddress = serverIPAddresses.find(
        (el) => el.id == publishExamForm.server_ip_address
    );

    if (!serverIPAddress) return;

    const buttonDropdownRef = useRef(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [postToPublishTest, setPostToPublishTest] = useState([]);
    const [postList, setPostList] = useState([]);

    const postsListQuery = useQuery({
        queryKey: ['GET-POST-LIST-FROM-SERVER(FORM-FILLING-PANEL)', serverIPAddress],
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
            const filteredList = prev.filter((_post) => _post.ca_post_id != newPost.ca_post_id);
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

    const removePostFromPublishList = (post) => { };

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonDropdownRef.current && !buttonDropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex items-center justify-between mb-1.5">
                <InputLabel
                    name="Select Post"
                    className="!mb-0 !text-[0.725rem] font-black text-slate-500 uppercase tracking-widest"
                />
                <IoRefresh
                    className={`cursor-pointer text-blue-600 text-lg hover:text-blue-800 transition-colors ${postsListQuery.isPending || postsListQuery.isRefetching
                        ? 'animate-spin'
                        : ''
                        }`}
                    onClick={() => {
                        postsListQuery.refetch();
                    }}
                />
            </div>

            <div ref={buttonDropdownRef} className="relative">
                <MdWork className="absolute left-4 top-4 text-blue-500 text-xl pointer-events-none z-10" />
                <button 
                    type="button"
                    className="cursor-pointer relative !w-full min-h-[3rem] rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 font-bold text-[0.95rem] pl-11 pr-8 focus:border-blue-500 focus:bg-white focus:ring-[5px] focus:ring-blue-500/10 outline-none transition-all text-slate-800 disabled:opacity-50 text-left flex flex-wrap items-center gap-1 pb-1 pt-1"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDropdown(!showDropdown);
                    }}
                >
                    {postToPublishTest.length === 0 && <span className="py-1">-- Select -- </span>}

                    <IoIosArrowDropdown
                        className={`text-xl absolute right-3 top-[50%] translate-y-[-50%] transition-all duration-300 text-slate-400 ${showDropdown ? 'rotate-180' : ''
                            }`}
                    />

                    {postToPublishTest.length > 0 &&
                        postToPublishTest.map((postToPublish) => {
                            return (
                                <span key={postToPublish.ca_post_id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 mt-1 mr-1 shadow-sm">
                                    <span>{postToPublish.ca_post_name}</span>
                                    <FaXmark
                                        className="cursor-pointer hover:text-rose-500 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const filteredList = postToPublishTest.filter(
                                                (post) =>
                                                    post.ca_post_id !=
                                                    postToPublish.ca_post_id
                                            );
                                            setPostToPublishTest(filteredList);
                                            setPostList((prev) => {
                                                return [...prev, postToPublish];
                                            });
                                        }}
                                    />
                                </span>
                            );
                        })}
                </button>

                <ul
                    className={`absolute transition-all duration-300 ${!showDropdown ? 'opacity-0 invisible translate-y-2' : 'opacity-100 visible translate-y-0'
                        } left-0 top-[105%] z-50 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-h-48 overflow-y-auto rounded-xl py-2`}>
                    {postList.map((post) => {
                        return (
                            <li
                                key={post.ca_post_id}
                                className="list-item relative px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors font-medium text-[0.9rem] text-slate-700"
                                onClick={(e) => {
                                    addPostToPublishHandler(post);
                                }}>
                                <label htmlFor={post.ca_post_id} className="cursor-pointer block w-full pointer-events-none">
                                    {post.ca_post_name}
                                </label>
                            </li>
                        );
                    })}

                    {postList.length === 0 && <li className="px-4 py-3 text-slate-400 text-sm italic text-center">No posts available.</li>}
                </ul>

                {errors.selected_posts && <span className="text-rose-500 text-xs font-semibold mt-1 block">{errors.selected_posts}</span>}
            </div>
        </>
    );
}

export default memo(SelectPostDropdown);
