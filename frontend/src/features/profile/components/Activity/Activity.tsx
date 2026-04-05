import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import { IPost, Post } from "../../../feed/components/Post/Post";
import classes from "./Activity.module.scss";

interface IActivityProps {
  user: IUser | null;
  authUser: IUser | null;
  id: string | undefined;
}

export function Activity({ user, authUser, id }: IActivityProps) {
  const [insights, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    request<IPost[]>({
      endpoint: `/api/v1/feed/posts/user/${id}`,
      onSuccess: (data) => setPosts(data),
      onFailure: (error) => console.log(error),
    });
  }, [id]);

  return (
    <div className={classes.activity}>
      <h2>Latest insight</h2>

      <div className={classes.insights}>
        {insights.length > 0 ? (
          <>
            <Post
              key={insights[insights.length - 1].id}
              post={insights[insights.length - 1]}
              setPosts={setPosts}
            />

            <Link className={classes.more} to={`/profile/${user?.id}/insights`}>
              See more
            </Link>
          </>
        ) : (
          <>
            {authUser?.id == user?.id
              ? "You have no insights yet."
              : "This user has no insights yet."}
          </>
        )}
      </div>
    </div>
  );
}